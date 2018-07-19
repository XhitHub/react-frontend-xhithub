
class PrologMaker {
  constructor() {
   }

   predicateToPL(p){
     var sent = p.text.replace(/\s/g, '_');
     var args = '';
     if(p.arguments){
       var arr = p.arguments;
       arr.forEach((arg) => {
         var argVar;
         if(p.variables && p.variables[arg]){
           argVar = p.variables[arg]
         }
         else if(p.parameters && p.parameters[arg]){
           argVar = p.parameters[arg]
         }
         else{
           argVar = '_'+arg
         }
         args += ", " + argVar
       });
       args = args.substring(2)
     }
     var raw = sent + "("+args+")";
     return raw;
   }

   formulaToPL(formula){
     var and = ' , '
     var or = ' ; '
     var not = ' \\+'
     if(formula.and){
       var s = ''
       formula.and.forEach(item=>{
         s += (and + this.formulaToPL(item));
       })
       return s.substring(and.length);
     }
     if(formula.or){
       var s = ''
       formula.or.forEach(item=>{
         s += (or + this.formulaToPL(item));
       })
       return s.substring(or.length);
     }
     if(formula.not){
       var s = not+'('+this.formulaToPL(formula.not)+')'
       return s.substring(and.length);
     }
     if(formula.text){
       return this.predicateToPL(formula);
     }
   }

   ruleToPL(rule){
     var lhs = this.formulaToPL(rule.lhs);
     var rhs = this.formulaToPL(rule.rhs);
     return (rhs + '  :-  '+lhs);
   }

   rulePacksToPL(rulePacks){
     var pl = ''
     rulePacks.forEach((item) => {
       pl += this.ruleToPL(item.rule) + '.\n';
     })
     return pl;
   }

   factPacksToPL(factPacks){
     var pl = ''
     factPacks.forEach((item) => {
       pl += this.formulaToPL(item.fact) + '.\n';
     })
     return pl;
   }

   problemsToPL(problems){
     var pl = 'consult(facts).\nconsult(rules).\n\n';
     problems.forEach(p=>{
       pl += '\n'+this.formulaToPL(p.fact)+'.';
     })
     return pl;
   }
}

export default PrologMaker;
