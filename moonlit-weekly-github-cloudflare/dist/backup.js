(function(root){
function validateBackup(payload){
 const fail=()=>{throw new Error('备份格式不正确或数据不完整，未修改现有数据')};
 if(!payload||payload.format!=='xiangxiang-weekly'||payload.version!==1||!payload.data)fail();
 const d=payload.data;if(!Array.isArray(d.tasks)||!Array.isArray(d.events)||d.tasks.length>10000||d.events.length>50000)fail();
 const ids=new Set(),eventIds=new Set();
 const text=(s,max)=>typeof s==='string'&&s.length<=max;
 const tasks=d.tasks.map(t=>{if(!t||!text(t.id,128)||!t.id||ids.has(t.id)||!text(t.title,80)||!t.title.trim()||!text(t.detail,300)||!Number.isInteger(t.stars)||t.stars<0||t.stars>3||!Number.isInteger(t.art)||t.art<0||t.art>6||(t.done!=null&&(typeof t.done!=='string'||!Number.isFinite(Date.parse(t.done)))))fail();ids.add(t.id);return{id:t.id,title:t.title,detail:t.detail,stars:t.stars,art:t.art===6?1:t.art,done:t.done||null}});
 const events=d.events.map(e=>{if(!e||!text(e.id,128)||!e.id||eventIds.has(e.id)||!ids.has(e.task)||typeof e.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!Number.isInteger(e.start)||e.start<0||!Number.isInteger(e.duration)||e.duration<15||e.start+e.duration>1440)fail();const date=new Date(e.date+'T12:00:00Z');if(!Number.isFinite(+date)||date.toISOString().slice(0,10)!==e.date)fail();eventIds.add(e.id);return{id:e.id,task:e.task,date:e.date,start:e.start,duration:e.duration}});
 if(d.headerTitle!=null&&(!text(d.headerTitle,80)||!d.headerTitle.trim()))fail();if(d.name!=null&&(!text(d.name,16)||!d.name.trim()))fail();if(d.ratio!=null&&(typeof d.ratio!=='number'||!Number.isFinite(d.ratio)||d.ratio<.2||d.ratio>.55))fail();if(d.sort!=null&&typeof d.sort!=='boolean')fail();if(d.sound!=null&&typeof d.sound!=='boolean')fail();if(d.volume!=null&&(typeof d.volume!=='number'||!Number.isFinite(d.volume)||d.volume<0||d.volume>1))fail();
 return{tasks,events,name:d.name||'香香',headerTitle:d.headerTitle??((d.name||'香香')+' Weekly'),ratio:d.ratio??.34,sort:d.sort??false,sound:d.sound??false,volume:d.volume??.4};
}
function makeBackup(data){return{format:'xiangxiang-weekly',version:1,exportedAt:new Date().toISOString(),data:JSON.parse(JSON.stringify(data))}}
root.WeeklyBackup={validateBackup,makeBackup};if(typeof module!=='undefined')module.exports=root.WeeklyBackup;
})(typeof window!=='undefined'?window:globalThis);
