
class MachineLearning {
  constructor() {
    this.index = 0;
   }

   dictFillPron(token,dict){
     if(token.pos_ == 'PRON'){
       if(!dict[token.dep_]){
         dict[token.dep_] = {
           pron:[],
           noun:[]
         }
       }
       dict[token.dep_].pron.push(token.text)
     }
     token.children.forEach(c=>{
       this.dictFillPron(c,dict)
     })
     return dict
   }

   dictFillNoun(token,dict){
     if(token.pos_ == 'NOUN'){
       if(!dict[token.dep_]){
         dict[token.dep_] = {
           pron:[],
           noun:[]
         }
       }
       dict[token.dep_].noun.push(token.text)
     }
     token.children.forEach(c=>{
       this.dictFillNoun(c,dict)
     })
     return dict
   }

   replaceHeSheItWithDict(token,dict){
     if(token.pos_ == 'PRON'){
       var i = dict[token.dep_].pron.indexOf(token.text)
       if(dict[token.dep_].noun.length > 0){
         if(i > dict[token.dep_].noun.length - 1){
           i = dict[token.dep_].noun.length - 1
         }
         //replace
         token.text = dict[token.dep_].noun[i]
         token.pos_ = "NOUN"
       }
     }
     token.children.forEach(c=>{
       this.replaceHeSheItWithDict(c,dict)
     })
     return token
   }

   replaceHeSheIt(token, currentNoun = ''){
     if(token.pos_ == 'NOUN'){
       currentNoun = token.text
     }
     if(token.pos_ == 'PRON'){
       console.log('pron',token.text)
       console.log('currentNoun',currentNoun)
       if(currentNoun != ''){
         token.text = currentNoun
       }
     }
     if(token.children){
       token.children.forEach(c=>{
         this.replaceHeSheIt(c,currentNoun)
       })
     }
     return token
   }

   convolute(token, typesToTrim, mode){
     token.children = token.children.filter(child=>{
       var needTrim = typesToTrim.find(d=>{
         return d == child[mode]
       })
       return !needTrim
     })
     token.children.forEach(child=>{
       this.convolute(child, typesToTrim, mode)
     })
     return token
   }

   fillArgsDictByTree(token,dict,index = 0){
     if(!dict[token.text]){
       dict[token.text] = {
         argName: 'arg_'+this.index,
         foundInTree: true,
         foundInKnowledge: false
       }
       this.index++;
     }
     else{
       dict[token.text].foundInTree = true
     }
     token.children.forEach(child=>{
       this.fillArgsDictByTree(child, dict,index)
     })
     return dict
   }

   fillArgsDictByFormula(formula,dict){
     if(formula.text){
       for(var k in dict){
         var textTokens = formula.text.split(' ')
         if(textTokens.find(item=>{
           return item == k
         })){
           dict[k].foundInKnowledge = true
         }
         if(formula.arguments.find(item=>{
           return item == k
         })){
           dict[k].foundInKnowledge = true
         }
         if(formula.variables){
           for(var k2 in formula.variables){
             if(k2 == k){
               dict[k].foundInKnowledge = true
             }
           }
         }
       }
     }
     if(formula.and){
       formula.and.forEach(item=>{
         this.fillArgsDictByFormula(item,dict)
       })
     }
     if(formula.or){
       formula.or.forEach(item=>{
         this.fillArgsDictByFormula(item,dict)
       })
     }
     if(formula.not){
       this.fillArgsDictByFormula(formula.not,dict)
     }
     return dict
   }

   fillArgsDictByRule(rule,dict){
     this.fillArgsDictByFormula(rule.lhs,dict)
     this.fillArgsDictByFormula(rule.rhs,dict)
   }

   generateArgsDictForFact(tree,fact){
     var dict = {}
     this.fillArgsDictByTree(tree,dict)
     this.fillArgsDictByFormula(fact,dict)
     var res = this.trimArgsDict(dict)
     console.log('generateArgsDictForFact res',res)
     return res
   }

   generateArgsDictForRule(tree,rule){
     var dict = {}
     this.fillArgsDictByTree(tree,dict)
     this.fillArgsDictByRule(rule,dict)
     var res = this.trimArgsDict(dict)
     console.log('generateArgsDictForRule res',res)
     return res
   }

   trimArgsDict(dict){
     // only preserve dictItem.foundInTree && dictItem.foundInKnowledge
     var newDict = {}
     for(var k in dict){
       if(dict[k].foundInTree && dict[k].foundInKnowledge){
         newDict[k] = dict[k]
       }
     }
     return newDict
   }

   argizeTree(token, argsDict){
     var dictItem = argsDict[token.text]
     if(dictItem){
       token.text = dictItem.argName
     }
     token.children.forEach(child=>{
       this.argizeTree(child, argsDict)
     })
     return token
   }

   argizeFormula(formula, argsDict){
     for(var k in argsDict){
       formula = this.singleArgizeFormula(formula, k, argsDict[k].argName)
     }
     return formula
   }

   argizeRule(rule, argsDict){
     this.argizeFormula(rule.lhs, argsDict)
     this.argizeFormula(rule.rhs, argsDict)
     return rule
   }

   argizeTreeFact(tree, fact){
     this.index = 0
     var argsDict = this.generateArgsDictForFact(tree, fact)
     this.argizeTree(tree, argsDict)
     this.argizeFormula(fact, argsDict)
   }

   argizeTreeRule(tree, rule){
     this.index = 0
     var argsDict = this.generateArgsDictForRule(tree, rule)
     this.argizeTree(tree, argsDict)
     this.argizeRule(rule, argsDict)
   }

   singleArgizeFormula(formula, key, arg){
     if(formula.text){
       var regex = new RegExp(key,"g");
       formula.text = formula.text.replace(regex,arg)
     }
     if(formula.arguments){
       for(var i = 0; i<formula.arguments.length; i++){
         if(formula.arguments[i] == key){
           formula.arguments[i] = arg
         }
       }
     }
     if(formula.variables){
       if(formula.variables[key]){
         formula.variables[key] = arg
       }
     }
     if(formula.and){
       formula.and.forEach(item=>{
         this.singleArgizeFormula(item, key, arg)
       })
     }
     if(formula.or){
       formula.or.forEach(item=>{
         this.singleArgizeFormula(item, key, arg)
       })
     }
     if(formula.not){
       this.singleArgizeFormula(formula.not, key, arg)
     }
     return formula
   }
}

export default MachineLearning;
