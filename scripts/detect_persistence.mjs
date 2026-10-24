import fs from "node:fs";
const ev=JSON.parse(fs.readFileSync(process.argv[2]||"tests/sample-persistence.json","utf8"));
let reg=0, task=0;
for(const e of ev){
  const isReg = e.type==="registry" && /CurrentVersion\\Run(Once)?\\/i.test(e.TargetObject);
  const isTask = e.type==="process" && /schtasks\.exe$/i.test(e.Image) && /\/create/i.test(e.CommandLine);
  if(isReg) reg++; if(isTask) task++;
  console.log((isReg?"REG_ALERT ":isTask?"TASK_ALERT ":"ok        ")+JSON.stringify(e).slice(0,100));
}
console.log("reg_hits="+reg+" task_hits="+task+" total="+ev.length);
if(reg!==2||task!==1) process.exit(1);
