/* Short tactile clicks and warm glass. All sound is synthesized locally. */
(function(root){
function create(options){
 let context,master,compressor,generation=0,lastAt=-Infinity;const active=new Set();
 const level=()=>{const v=Number(options.volume());return Number.isFinite(v)?Math.max(0,Math.min(1,v)):.4};
 function init(){if(context)return true;const Audio=root.AudioContext||root.webkitAudioContext;if(!Audio)return false;context=new Audio();master=context.createGain();master.gain.value=0;compressor=context.createDynamicsCompressor();compressor.threshold.value=-14;compressor.knee.value=12;compressor.ratio.value=5;compressor.attack.value=.003;compressor.release.value=.12;master.connect(compressor);compressor.connect(context.destination);return true}
 function tone(frequency,time,duration,gain,type='sine',endFrequency){const node=context.createOscillator(),amp=context.createGain();node.type=type;node.frequency.setValueAtTime(frequency,time);if(endFrequency)node.frequency.exponentialRampToValueAtTime(endFrequency,time+duration);amp.gain.setValueAtTime(0,time);amp.gain.linearRampToValueAtTime(gain,time+.006);amp.gain.exponentialRampToValueAtTime(.0001,time+duration);node.connect(amp);amp.connect(master);node.onended=()=>{active.delete(node);node.disconnect();amp.disconnect()};active.add(node);node.start(time);node.stop(time+duration+.015)}
 function click(time,strength=.45,bright=1500){
  const rate=context.sampleRate,duration=.065,buffer=context.createBuffer(1,Math.ceil(rate*duration),rate),samples=buffer.getChannelData(0);let seed=17;
  for(let i=0;i<samples.length;i++){const t=i/rate;seed=(seed*1664525+1013904223)>>>0;const noise=seed/2147483648-1;const attack=1-Math.exp(-t/.00025),tail=Math.pow(Math.max(0,1-t/duration),2);samples[i]=strength*attack*tail*(noise*.52*Math.exp(-t/.0018)+.28*Math.sin(2*Math.PI*bright*t)*Math.exp(-t/.0035)+.21*Math.sin(2*Math.PI*bright*.47*t)*Math.exp(-t/.007)+.13*Math.sin(2*Math.PI*185*t)*Math.exp(-t/.012))}
  const node=context.createBufferSource();node.buffer=buffer;node.connect(master);active.add(node);node.onended=()=>{active.delete(node);node.disconnect()};node.start(time);node.stop(time+duration)
 }
 function cardDraw(time){
  // A quick, dry sliding gesture: friction builds as the card leaves the deck.
  const rate=context.sampleRate;
  for(let layer=0;layer<2;layer++){
   const duration=layer?.1:.23,offset=layer?.12:0,buffer=context.createBuffer(1,Math.ceil(rate*duration),rate),samples=buffer.getChannelData(0);let low=0,slow=0,seed=layer?883:313;
   for(let i=0;i<samples.length;i++){
    const t=i/rate,u=t/duration;seed=(seed*1664525+1013904223)>>>0;const noise=seed/2147483648-1;
    const cutoff=layer?1600:800+2400*Math.sin(Math.PI*u*.82),alpha=1-Math.exp(-2*Math.PI*cutoff/rate);low+=alpha*(noise-low);slow+=.03*(noise-slow);
    const envelope=Math.pow(Math.sin(Math.PI*u),layer?2:1.4)*(1-Math.exp(-t/.014));
    const grain=layer?Math.pow(.5+.5*Math.sin(2*Math.PI*117*t),5):(.94+.06*Math.sin(2*Math.PI*(87*t+95*t*t)));
    samples[i]=(low-slow)*envelope*grain*(layer?.0325:.19);
   }
   const node=context.createBufferSource();node.buffer=buffer;node.connect(master);active.add(node);node.onended=()=>{active.delete(node);node.disconnect()};node.start(time+offset);node.stop(time+offset+duration);
  }
 }
 function sync(){generation++;if(!context)return;const t=context.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(options.enabled()?level()*.65:0,t);if(!options.enabled()||level()===0){for(const node of active){try{node.stop()}catch{}}active.clear()}}
 function play(kind='place'){
  if(!options.enabled()||level()===0)return Promise.resolve(false);
  try{if(!init())return Promise.resolve(false);const token=generation;const resume=context.state==='running'?Promise.resolve():context.resume();return Promise.resolve(resume).then(()=>{
   if(token!==generation||!options.enabled()||level()===0||context.state!=='running')return false;
   const now=context.currentTime;if(now-lastAt<.075)return false;lastAt=now;master.gain.setValueAtTime(level()*.65,now);const t=now+.008;
   if(kind==='flip'){cardDraw(t)}
   else if(kind==='gear'){click(t,.28,2400);click(t+.032,.35,1950);click(t+.076,.48,1450)}
   else if(kind==='complete'){[523.25,659.25,783.99].forEach((f,i)=>{tone(f,t+i*.085,.55,.09);tone(f*2,t+i*.085,.2,.012)})}
   else if(kind==='grab'){click(t,.2,1100)}
   else if(kind==='delete'){click(t,.21,850)}
   else if(kind==='switch'){click(t,.24,1900)}
   else {click(t,.5,1250);click(t+.009,.16,2600)}
   return true;
  }).catch(()=>false)}catch{return Promise.resolve(false)}
 }
 function unlock(){if(!options.enabled()||level()===0)return;try{if(init()&&context.state!=='running')Promise.resolve(context.resume()).catch(()=>{})}catch{}}
 return{play,sync,unlock};
}
root.WeeklyAudio={create};if(typeof module!=='undefined')module.exports={create};
})(typeof window!=='undefined'?window:globalThis);
