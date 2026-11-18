// Connected overlap groups share columns; touching endpoints do not overlap.
function layoutEvents(events){
  const sorted=[...events].sort((a,b)=>a.start-b.start||b.duration-a.duration||a.id.localeCompare(b.id));
  const result=new Map();let group=[],end=-Infinity;
  function flush(){if(!group.length)return;const ends=[];for(const event of group){let col=ends.findIndex(end=>end<=event.start);if(col<0)col=ends.length;ends[col]=event.start+event.duration;result.set(event.id,{col})}for(const event of group)result.get(event.id).columns=ends.length;group=[]}
  for(const event of sorted){if(event.start>=end){flush();end=-Infinity}group.push(event);end=Math.max(end,event.start+event.duration)}flush();return result;
}
if(typeof module!=='undefined')module.exports={layoutEvents};
