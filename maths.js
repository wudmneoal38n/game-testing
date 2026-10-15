// Small, whole-number answers keep every activity suitable for early learners.
export const activities = {
  addition: {name:'Addition', symbol:'+'},
  subtraction: {name:'Subtraction', symbol:'−'},
  multiplication: {name:'Multiplication', symbol:'×'},
  division: {name:'Division', symbol:'÷'},
  fractions: {name:'Fractions', symbol:'of'}
};
export function createQuestions(mode, table='mixed') {
  const questions=[];
  for(let a=1;a<=9;a++) for(let b=1;b<=9;b++) {
    if(mode==='multiplication' && table!=='mixed' && a!==Number(table)) continue;
    let first=a,second=b,answer=a*b,hint=`${a} groups of ${b}. Count the dots!`;
    if(mode==='addition'){answer=a+b;hint=`Start at ${a}, then count on ${b} more.`;}
    if(mode==='subtraction'){first=a+b;answer=a;hint=`Start with ${a+b}. Take away ${b}. Count what is left.`;}
    if(mode==='division'){first=a*b;answer=a;hint=`Share ${a*b} into ${b} equal groups. How many in each group?`;}
    if(mode==='fractions'){
      const [n,d]=[[1,2],[1,3],[1,4],[3,4]][(a-1)%4];
      first=`${n}/${d}`;second=b*d;answer=b*n;
      hint=`Share ${second} into ${d} equal groups${n>1?`, then take ${n} groups`:'. Take 1 group'}.`;
    }
    questions.push({first,second,answer,hint,operator:activities[mode].symbol});
  }
  return questions;
}
