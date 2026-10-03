const MODES={
PERSONA:["境界観測者","静寂演算者","深夜の鍵守"],
神獣:["玻璃雷狐","月喰いの鴉","万華鏡猫"],
悪魔:["収集癖の悪魔","未送信の悪魔","反復の悪魔"],
職業:["境界設計士","記憶修復師","夜間地図師"],
オークション:["未完の観測装置","夜を保存する椅子","夢の複製器"],
薬剤:["NOCT-07","MIRROR-X","VIOLET LOOP"],
五行:["水陰偏位型","木陽拡張型","金陰研磨型"],
CHAOS:["NULL ANGEL","PURPLE ERROR","SEVENTH SIGNAL"]
};
const attrs=["観察","変容","直感","構築","執着","探索","希少","混沌"];
const worlds=["夢と現実の境界都市","永夜の図書塔","鏡面湖","地下収蔵庫","未定義領域"];
const rarities=[["N",40],["R",28],["SR",18],["SSR",10],["UR",4]];
let mode="PERSONA",current=null;
const $=s=>document.querySelector(s),pick=a=>a[Math.floor(Math.random()*a.length)];
function roll(){let x=Math.random()*100;for(const [n,w] of rarities){x-=w;if(x<=0)return n}return"N"}
Object.keys(MODES).forEach(k=>{const b=document.createElement("button");b.className="mode"+(k===mode?" active":"");b.textContent=k;b.onclick=()=>{mode=k;document.querySelectorAll(".mode").forEach(x=>x.classList.remove("active"));b.classList.add("active")};$("#modes").appendChild(b)});
function make(){const input=$("#input").value.trim(),title=pick(MODES[mode]),r=roll(),a=pick(attrs),w=pick(worlds);return{id:Date.now(),mode,title,rarity:r,attr:a,world:w,fav:false,desc:`${title}は「${a}」を核に持つ存在。${w}で姿を現す。${input?`入力された「${input.slice(0,60)}」の要素も反映される。`:""}`}}
function art(x){const hue={N:245,R:265,SR:285,SSR:310,UR:45}[x.rarity];return `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g"><stop stop-color="hsl(${hue},90%,70%)"/><stop offset=".55" stop-color="hsl(${hue},80%,30%)"/><stop offset="1" stop-color="#06030a"/></radialGradient></defs><rect width="400" height="500" fill="#07040c"/><circle cx="200" cy="225" r="130" fill="url(#g)"/><circle cx="200" cy="225" r="85" fill="none" stroke="white" opacity=".5"/><path d="M200 80L235 175L330 195L255 255L275 355L200 300L125 355L145 255L70 195L165 175Z" fill="none" stroke="white" opacity=".7" stroke-width="3"/><text x="200" y="430" text-anchor="middle" fill="white" font-size="22" font-weight="700">${x.title}</text><text x="200" y="460" text-anchor="middle" fill="hsl(${hue},90%,85%)" font-size="13">${x.rarity} / ${x.mode}</text></svg>`}
function hist(){return JSON.parse(localStorage.getItem("chovill_history")||"[]")}
function save(h){localStorage.setItem("chovill_history",JSON.stringify(h.slice(0,30)))}
function renderHistory(){const h=hist();$("#history").innerHTML=h.length?"":"<p style='color:#9282a9'>まだ履歴はありません。</p>";h.forEach(x=>{const d=document.createElement("div");d.className="card";d.innerHTML=`<b>${x.fav?"★ ":""}${x.title}</b> <span>${x.rarity}</span><br><small>${x.mode} / ${x.attr}</small>`;d.onclick=()=>show(x);$("#history").appendChild(d)})}
function show(x){current=x;$("#result").classList.remove("hidden");$("#rarity").textContent=`${x.rarity} RARITY`;$("#visual").innerHTML=art(x);$("#title").textContent=x.title;$("#desc").textContent=x.desc;$("#fav").textContent=x.fav?"★ お気に入り":"☆ お気に入り";$("#result").scrollIntoView({behavior:"smooth"})}
async function generate(){ $("#overlay").classList.remove("hidden");await new Promise(r=>setTimeout(r,1200));const x=make();const h=hist();h.unshift(x);save(h);renderHistory();$("#overlay").classList.add("hidden");show(x)}
$("#generate").onclick=generate;$("#again").onclick=generate;$("#fav").onclick=()=>{if(!current)return;const h=hist(),x=h.find(v=>v.id===current.id);if(x){x.fav=!x.fav;save(h);renderHistory();show(x)}};$("#share").onclick=async()=>{if(!current)return;const text=`CHOVILL LAB\n${current.rarity} ${current.title}\n${current.desc}`;if(navigator.share)await navigator.share({title:current.title,text});else{await navigator.clipboard.writeText(text);alert("コピーしました")}};$("#clear").onclick=()=>{if(confirm("履歴を削除しますか？")){localStorage.removeItem("chovill_history");renderHistory()}};renderHistory();