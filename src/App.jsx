import { useState, useEffect, useRef, useCallback } from "react";

const NAVY="#1B2A4A",NAVY_L="#243660",GOLD="#C9A84C",PARCH="#F5F0E8",PARCH_D="#EDE6D6",SAGE="#7A9E8A",COAL="#2D2D2D",GRAY="#8A8A8A",GRAY_L="#E8E8E8",WHITE="#FFFFFF";

const SOURCE_META={
  devotional:{bg:"#E8F0FE",dot:"#C9A84C",label:"BYU Devotional"},
  conference:{bg:"#FFF3E0",dot:"#E67E22",label:"General Conference"},
  article:{bg:"#E8F5E9",dot:"#7A9E8A",label:"Article"},
  book:{bg:"#F3E5F5",dot:"#8E44AD",label:"Book"},
  papers:{bg:"#FCE4EC",dot:"#C0392B",label:"Primary Source"},
  funfact:{bg:"#E3F2FD",dot:"#2196F3",label:"Fun Fact"},
  historic:{bg:"#FFF8E1",dot:"#F57F17",label:"Historic Conference"},
  studies:{bg:"#F3E5F5",dot:"#6A1B9A",label:"BYU Studies"},
};

const POOL=[
  {id:1,type:"devotional",source:"BYU Speeches",title:"Gifts of the Spirit for Hard Times",author:"Henry B. Eyring",date:"Sep 2006",topic:["Faith","Holy Ghost"],url:"https://speeches.byu.edu/talks/henry-b-eyring/gifts-spirit-hard-times/",excerpt:"The gifts of the Spirit are calibrated to whether our purposes have become His purposes.",isNew:false},
  {id:2,type:"article",source:"Interpreter Foundation",title:"Historical Evidence for the Prophet Jonah",author:"John Gee",date:"2023",topic:["Old Testament","Jonah"],url:"https://interpreterfoundation.org",excerpt:"A careful examination of ancient Near Eastern records corroborating the Jonah narrative.",isNew:true},
  {id:3,type:"conference",source:"General Conference",title:"The Power of Sustained Faith",author:"Jeffrey R. Holland",date:"Oct 2023",topic:["Faith","Testimony"],url:"https://www.churchofjesuschrist.org/study/general-conference",excerpt:"Doubt your doubts before you doubt your faith.",isNew:false},
  {id:4,type:"book",source:"Deseret Book",title:"Rational Theology",author:"John A. Widtsoe",date:"1915",topic:["Doctrine","Philosophy"],url:"https://deseretbook.com",excerpt:"The gospel of Jesus Christ invites the most rigorous possible application of the human mind.",isNew:false},
  {id:5,type:"papers",source:"Joseph Smith Papers",title:"Letter from Liberty Jail",author:"Joseph Smith",date:"Mar 1839",topic:["Church History","Revelation"],url:"https://www.josephsmithpapers.org",excerpt:"The things of God are of deep import; and time, and experience, and careful solemn thoughts can only find them out.",isNew:true},
  {id:6,type:"devotional",source:"BYU Speeches",title:"The Character of Christ",author:"David A. Bednar",date:"Dec 2001",topic:["Discipleship","Character"],url:"https://speeches.byu.edu",excerpt:"The Savior's consistent and ultimate turning outward, even in the most difficult of personal circumstances.",isNew:false},
  {id:7,type:"article",source:"FAIR",title:"The Word of Wisdom in Historical Context",author:"FAIR Staff",date:"2024",topic:["Word of Wisdom","Church History"],url:"https://www.fairlatterdaysaints.org",excerpt:"How the Word of Wisdom developed from a word of counsel into a binding commandment.",isNew:true},
  {id:8,type:"funfact",source:"U.T. Daily",title:"Did You Know?",author:null,date:null,topic:["Church History"],url:null,excerpt:"Wilford Woodruff kept a personal journal for over 60 years — 33 volumes and 3,000+ pages, one of the most detailed records in Latter-day Saint history.",isNew:false},
  {id:9,type:"conference",source:"General Conference",title:"Safety for the Soul",author:"Jeffrey R. Holland",date:"Oct 2009",topic:["Book of Mormon","Testimony"],url:"https://www.churchofjesuschrist.org/study/general-conference",excerpt:"I ask that my testimony of the Book of Mormon might be recorded by angels and deposited in stone.",isNew:false},
  {id:10,type:"devotional",source:"BYU Speeches",title:"Your Refined Heavenly Home",author:"Douglas L. Callister",date:"Oct 2006",topic:["Celestial Kingdom","Exaltation"],url:"https://speeches.byu.edu",excerpt:"Those who dwell with God will speak of things they have seen and heard in the presence of the divine.",isNew:false},
  {id:11,type:"papers",source:"Wilford Woodruff Papers",title:"Last Meeting with Joseph Smith",author:"Wilford Woodruff",date:"Mar 1844",topic:["Church History","Joseph Smith"],url:"https://wilfordwoodruffpapers.org",excerpt:"Joseph stood before us and his face shone clear as amber, clothed with light and glory.",isNew:true},
  {id:12,type:"book",source:"Deseret Book",title:"The Infinite Atonement",author:"Tad R. Callister",date:"2000",topic:["Atonement","Doctrine"],url:"https://deseretbook.com",excerpt:"The Atonement of Jesus Christ is the most transcendent event that has ever occurred in all of the universe.",isNew:false},
  {id:13,type:"funfact",source:"U.T. Daily",title:"Did You Know?",author:null,date:null,topic:["Restoration"],url:null,excerpt:"John A. Widtsoe was a world-renowned agricultural scientist before becoming an apostle, holding a doctorate from the University of Göttingen.",isNew:false},
  {id:14,type:"article",source:"Interpreter Foundation",title:"Elijah and the Restoration of Sealing Keys",author:"Matthew B. Brown",date:"2021",topic:["Temple","Elijah","Restoration"],url:"https://interpreterfoundation.org",excerpt:"The appearance of Elijah in the Kirtland Temple was the literal transfer of sealing authority to this dispensation.",isNew:false},
  {id:15,type:"conference",source:"General Conference",title:"Be Not Afraid, Only Believe",author:"Jeffrey R. Holland",date:"Apr 2015",topic:["Faith","Courage"],url:"https://www.churchofjesuschrist.org/study/general-conference",excerpt:"When you have to, you be strong. You be faithful. You be courageous.",isNew:false},
  {id:16,type:"funfact",source:"U.T. Daily",title:"Did You Know?",author:null,date:null,topic:["Book of Mormon"],url:null,excerpt:"The Book of Mormon was translated in approximately 65 working days — about 8 pages per day with almost no revisions.",isNew:false},
  {id:17,type:"devotional",source:"BYU Idaho Devotionals",title:"The Gospel and the University",author:"Kim B. Clark",date:"2012",topic:["Education","Gospel Scholarship"],url:"https://www.byui.edu/devotionals",excerpt:"The university and the gospel of Jesus Christ are not in conflict — they are expressions of the same eternal truth.",isNew:false},
  {id:18,type:"devotional",source:"BYU Hawaii Devotionals",title:"Finding Light in Dark Times",author:"John S. Tanner",date:"2018",topic:["Faith","Adversity"],url:"https://devotional.byuh.edu",excerpt:"The Lord does not promise us an easy path, but He promises us a lighted one.",isNew:false},
  {id:19,type:"devotional",source:"Ensign College Devotionals",title:"Becoming a Covenant People",author:"Sharon Eubank",date:"2020",topic:["Covenants","Discipleship"],url:"https://www.ensign.edu/devotionals",excerpt:"Every covenant we make is an invitation to become more fully who God intends us to be.",isNew:true},
  {id:20,type:"studies",source:"BYU Studies",title:"Chiasmus in the Book of Mormon",author:"John W. Welch",date:"1969",topic:["Book of Mormon","Literary Structure"],url:"https://byustudies.byu.edu",excerpt:"The discovery of chiasmus in the Book of Mormon stands as one of the most compelling evidences for its ancient authorship.",isNew:false},
  {id:21,type:"historic",source:"Historic General Conferences",title:"The Articles of Faith",author:"Joseph Smith",date:"1842",topic:["Doctrine","Restoration"],url:"https://historicgeneralconferences.weebly.com",excerpt:"We believe the Bible to be the word of God as far as it is translated correctly; we also believe the Book of Mormon to be the word of God.",isNew:false},
  {id:22,type:"historic",source:"Historic General Conferences",title:"On Celestial Marriage",author:"Brigham Young",date:"1852",topic:["Church History","Doctrine"],url:"https://historicgeneralconferences.weebly.com",excerpt:"The principle which God has revealed — that of patriarchal order and marriage — is one of the most glorious principles ever revealed to man.",isNew:false},
  {id:23,type:"studies",source:"BYU Studies",title:"The Joseph Smith Papyri and the Book of Abraham",author:"Kerry Muhlestein",date:"2014",topic:["Book of Abraham","Apologetics"],url:"https://byustudies.byu.edu",excerpt:"A careful examination of the Joseph Smith Papyri reveals a sophisticated ancient text consistent with the Book of Abraham.",isNew:true},
  {id:24,type:"devotional",source:"BYU Idaho Devotionals",title:"Learning by Faith",author:"David A. Bednar",date:"2007",topic:["Education","Faith","Revelation"],url:"https://www.byui.edu/devotionals",excerpt:"Learning by faith requires spiritual, mental, and physical exertion and not just passive reception.",isNew:false},
  {id:25,type:"historic",source:"Historic General Conferences",title:"On the Nature of God",author:"Lorenzo Snow",date:"1893",topic:["Doctrine","Eternal Progression"],url:"https://historicgeneralconferences.weebly.com",excerpt:"As man now is, God once was; as God now is, man may be.",isNew:false},
  {id:26,type:"devotional",source:"BYU Hawaii Devotionals",title:"The Atonement and Our Daily Lives",author:"Tad R. Callister",date:"2015",topic:["Atonement","Discipleship"],url:"https://devotional.byuh.edu",excerpt:"The Atonement is not just for the spiritually wounded — it is the daily bread of the faithful disciple.",isNew:false},
  {id:27,type:"studies",source:"BYU Studies",title:"Wilford Woodruff and the Manifesto",author:"Thomas G. Alexander",date:"1988",topic:["Church History","Revelation"],url:"https://byustudies.byu.edu",excerpt:"An examination of the historical and spiritual circumstances surrounding the 1890 Manifesto ending plural marriage.",isNew:false},
  {id:28,type:"funfact",source:"U.T. Daily",title:"Did You Know?",author:null,date:null,topic:["Church History"],url:null,excerpt:"The Kirtland Temple took three years to build. Saints donated everything they had — some women cut up their finest china to mix into the plaster so it would sparkle in the light.",isNew:false},
  {id:29,type:"devotional",source:"Ensign College Devotionals",title:"Truth and the Educated Mind",author:"Henry B. Eyring",date:"2016",topic:["Education","Truth","Gospel Scholarship"],url:"https://www.ensign.edu/devotionals",excerpt:"Every truth you learn, wherever it comes from, belongs to the gospel of Jesus Christ.",isNew:false},
  {id:30,type:"historic",source:"Historic General Conferences",title:"The Keys of the Kingdom",author:"Wilford Woodruff",date:"1889",topic:["Priesthood","Keys","Restoration"],url:"https://historicgeneralconferences.weebly.com",excerpt:"The keys of this dispensation were committed to Joseph Smith and through him to the Twelve Apostles of this Church.",isNew:false},
];

const TOPICS=["Faith","Church History","Old Testament","Book of Mormon","Doctrine & Covenants","Temple","Atonement","Revelation","Restoration","Holy Ghost","Discipleship","Come Follow Me","Apologetics","Gospel Scholarship","Pearl of Great Price","Christlike Attributes"];
const PAGE=4;

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function getBatch(pool,start){return Array.from({length:PAGE},(_,i)=>({...pool[(start+i)%pool.length],uid:`${pool[(start+i)%pool.length].id}-${start+i}`}));}

const CSS=`
@keyframes glow{0%,100%{box-shadow:0 0 8px 3px rgba(201,168,76,.5),0 0 16px 6px rgba(201,168,76,.2)}50%{box-shadow:0 0 16px 6px rgba(201,168,76,.8),0 0 32px 12px rgba(201,168,76,.35)}}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.card{animation:up .3s ease both}
.lift{transition:transform .18s,box-shadow .18s}
.lift:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(27,42,74,.12)}
*{box-sizing:border-box}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:#C9A84C;border-radius:3px}
.pills{display:flex;gap:8px;padding:14px 20px;overflow-x:auto;background:#F5F0E8;border-bottom:1px solid #E8E8E8}
.pills::-webkit-scrollbar{display:none}
`;

function Styles(){return <style>{CSS}</style>;}

function SeerStone(){return <div style={{width:10,height:10,borderRadius:"50%",background:"radial-gradient(circle,#E8C96A 0%,#C9A84C 60%,#A07830 100%)",animation:"glow 3s ease-in-out infinite"}}/>;}

function Badge({type}){const m=SOURCE_META[type]||SOURCE_META.article;return(<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:20,background:m.bg,fontSize:11,fontWeight:700,color:NAVY}}><span style={{width:6,height:6,borderRadius:"50%",background:m.dot}}/>{m.label}</span>);}

function Tag({t}){return <span style={{padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,background:PARCH_D,color:NAVY}}>{t}</span>;}

function Card({item,onSave}){
  const [saved,setSaved]=useState(item.saved||false);
  const [noting,setNoting]=useState(false);
  const [note,setNote]=useState("");
  return(
    <div className="card lift" style={{background:WHITE,borderRadius:16,padding:"18px 20px",marginBottom:14,border:`1px solid ${GRAY_L}`,position:"relative"}}>
      {item.isNew&&<span style={{position:"absolute",top:14,right:14,background:SAGE,color:WHITE,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20}}>NEW</span>}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}><Badge type={item.type}/><span style={{fontSize:11,color:GRAY}}>{item.source}</span></div>
      <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color:NAVY,lineHeight:1.35,marginBottom:6}}>{item.title}</div>
      {item.author&&<div style={{fontSize:12,color:GRAY,marginBottom:8,fontStyle:"italic"}}>{item.author}{item.date?` · ${item.date}`:""}</div>}
      <div style={{fontSize:14,color:COAL,lineHeight:1.6,marginBottom:12,borderLeft:`3px solid ${GOLD}`,paddingLeft:10}}>{item.excerpt}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{item.topic.map(t=><Tag key={t} t={t}/>)}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {item.url&&<a href={item.url} target="_blank" rel="noopener noreferrer" style={{padding:"7px 14px",borderRadius:8,background:NAVY,color:WHITE,fontSize:12,fontWeight:600,textDecoration:"none"}}>Read →</a>}
        <button onClick={()=>{const ns=!saved;setSaved(ns);onSave&&onSave(item.id,ns,item);}} style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",background:saved?GOLD:PARCH_D,color:saved?WHITE:NAVY,fontSize:12,fontWeight:600}}>{saved?"★ Saved":"☆ Save"}</button>
        <button onClick={()=>setNoting(n=>!n)} style={{padding:"7px 14px",borderRadius:8,border:"none",cursor:"pointer",background:noting?SAGE:PARCH_D,color:noting?WHITE:NAVY,fontSize:12,fontWeight:600}}>✏️ Note</button>
      </div>
      {noting&&(
        <div style={{marginTop:12}}>
          <textarea placeholder="Add your thoughts…" value={note} onChange={e=>setNote(e.target.value)} style={{width:"100%",minHeight:80,padding:"10px 12px",borderRadius:8,border:`1.5px solid ${GOLD}`,fontFamily:"inherit",fontSize:13,background:PARCH,resize:"vertical",outline:"none"}}/>
          <div style={{display:"flex",gap:8,marginTop:6}}>
            <button onClick={()=>setNoting(false)} style={{padding:"6px 14px",borderRadius:8,background:NAVY,color:WHITE,fontSize:12,fontWeight:600,border:"none",cursor:"pointer"}}>Save Note</button>
            <button onClick={()=>{setNoting(false);setNote("");}} style={{padding:"6px 14px",borderRadius:8,background:GRAY_L,color:COAL,fontSize:12,fontWeight:600,border:"none",cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Spinner(){return <div style={{display:"flex",justifyContent:"center",padding:"24px 0"}}><div style={{width:28,height:28,borderRadius:"50%",border:`3px solid ${PARCH_D}`,borderTopColor:GOLD,animation:"spin .7s linear infinite"}}/></div>;}

function Nav({tab,setTab}){
  const tabs=[{id:"home",icon:"⌂",label:"Home"},{id:"library",icon:"☰",label:"Library"},{id:"saved",icon:"★",label:"Saved"},{id:"topics",icon:"◈",label:"Topics"},{id:"profile",icon:"◯",label:"Profile"}];
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:WHITE,borderTop:`1px solid ${GRAY_L}`,display:"flex",justifyContent:"space-around",padding:"10px 0 14px",boxShadow:"0 -4px 16px rgba(27,42,74,.08)",zIndex:100}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:tab===t.id?GOLD:GRAY,padding:"0 12px"}}>
          <span style={{fontSize:20}}>{t.icon}</span>
          <span style={{fontSize:10,fontWeight:600}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function Home({onSave}){
  const [filter,setFilter]=useState("All");
  const [pool]=useState(()=>shuffle(POOL));
  const [items,setItems]=useState([]);
  const [next,setNext]=useState(0);
  const [loading,setLoading]=useState(false);
  const sentinel=useRef(null);
  const filters=["All","Devotionals","Conference","Articles","Books","Primary Sources","Historic","BYU Studies"];
  const typeMap={Devotionals:"devotional",Conference:"conference",Articles:"article",Books:"book","Primary Sources":"papers",Historic:"historic","BYU Studies":"studies"};
  const active=filter==="All"?pool:pool.filter(i=>i.type===typeMap[filter]);

  useEffect(()=>{setItems(getBatch(active,0));setNext(PAGE);},[filter]);

  const more=useCallback(()=>{
    if(loading)return;
    setLoading(true);
    setTimeout(()=>{setItems(p=>[...p,...getBatch(active,next)]);setNext(n=>n+PAGE);setLoading(false);},600);
  },[loading,next,active]);

  useEffect(()=>{
    if(!sentinel.current)return;
    const obs=new IntersectionObserver(e=>{if(e[0].isIntersecting)more();},{threshold:0.1});
    obs.observe(sentinel.current);
    return()=>obs.disconnect();
  },[more]);

  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY_L} 100%)`,padding:"52px 20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><SeerStone/><span style={{fontFamily:"Georgia,serif",fontSize:13,color:GOLD,letterSpacing:2,fontWeight:600}}>U.T.</span><span style={{color:"rgba(255,255,255,.4)"}}>·</span><span style={{color:"rgba(255,255,255,.6)",fontSize:12}}>Urim and Thummim</span></div>
        <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:WHITE,marginBottom:4}}>Good morning, Jonah.</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.6)",marginBottom:18}}>Light and truth await.</div>
        <div style={{background:"rgba(255,255,255,.1)",borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,border:"1px solid rgba(255,255,255,.15)"}}><span style={{color:"rgba(255,255,255,.5)"}}>⌕</span><span style={{color:"rgba(255,255,255,.4)",fontSize:14}}>Search talks, articles, topics…</span></div>
      </div>
      <div className="pills">
        {filters.map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 14px",borderRadius:20,border:"none",background:filter===f?NAVY:WHITE,color:filter===f?WHITE:COAL,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{f}</button>)}
      </div>
      <div style={{padding:"16px 20px 100px",background:PARCH,minHeight:"100vh"}}>
        <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY_L} 100%)`,borderRadius:16,padding:"16px 18px",marginBottom:16,border:"1px solid rgba(201,168,76,.3)"}}>
          <div style={{fontSize:10,color:GOLD,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>COME FOLLOW ME · THIS WEEK</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:17,color:WHITE,fontWeight:700,marginBottom:4}}>1 Kings 17–22 — Elijah</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.65)",marginBottom:12,lineHeight:1.5}}>"If the Lord Be God, Follow Him" — Resources on Elijah and the Restoration of the sealing keys.</div>
          <button style={{padding:"7px 16px",borderRadius:8,background:GOLD,color:NAVY,fontSize:12,fontWeight:700,border:"none",cursor:"pointer"}}>Explore This Week →</button>
        </div>
        <div style={{fontSize:12,color:GRAY,fontWeight:700,letterSpacing:1,marginBottom:12}}>YOUR FEED</div>
        {items.map(item=><Card key={item.uid} item={item} onSave={onSave}/>)}
        <div ref={sentinel} style={{height:1}}/>
        {loading&&<Spinner/>}
        {!loading&&items.length>PAGE&&<div style={{textAlign:"center",padding:"8px 0",fontSize:11,color:GRAY}}>Scroll for more light and truth ↓</div>}
      </div>
    </div>
  );
}

function Library(){
  const sources=[
    {name:"BYU Speeches",desc:"25,000+ devotionals from BYU Provo",icon:"🎓",url:"https://speeches.byu.edu",count:"25,000+"},
    {name:"BYU Idaho Devotionals",desc:"Devotionals from BYU Idaho",icon:"🎓",url:"https://www.byui.edu/devotionals",count:"1,000+"},
    {name:"BYU Hawaii Devotionals",desc:"Devotionals from BYU Hawaii",icon:"🎓",url:"https://devotional.byuh.edu",count:"500+"},
    {name:"Ensign College Devotionals",desc:"Devotionals from Ensign College",icon:"🎓",url:"https://www.ensign.edu/devotionals",count:"200+"},
    {name:"General Conference",desc:"Every talk from 1971 to present",icon:"⛪",url:"https://www.churchofjesuschrist.org/study/general-conference",count:"10,000+"},
    {name:"Historic General Conferences",desc:"Early conference talks and sermons",icon:"📜",url:"https://historicgeneralconferences.weebly.com",count:"1800s+"},
    {name:"Interpreter Foundation",desc:"Peer-reviewed Latter-day Saint scholarship",icon:"📖",url:"https://interpreterfoundation.org",count:"500+"},
    {name:"BYU Studies",desc:"Academic journal of Latter-day Saint scholarship",icon:"🔬",url:"https://byustudies.byu.edu",count:"60 yrs"},
    {name:"FAIR",desc:"Faithful answers to critical questions",icon:"🛡️",url:"https://www.fairlatterdaysaints.org",count:"1,000+"},
    {name:"Joseph Smith Papers",desc:"Primary source documents of the Restoration",icon:"📋",url:"https://www.josephsmithpapers.org",count:"800+"},
    {name:"Wilford Woodruff Papers",desc:"60 years of prophetic journal keeping",icon:"✍️",url:"https://wilfordwoodruffpapers.org",count:"33 vols"},
    {name:"Deseret Book",desc:"Latter-day Saint books and publications",icon:"📚",url:"https://deseretbook.com",count:"5,000+"},
    {name:"Come Follow Me",desc:"Weekly study guides and resources",icon:"📅",url:"https://www.churchofjesuschrist.org/study/come-follow-me",count:"Current"},
  ];
  return(
    <div style={{padding:"60px 20px 100px",background:PARCH,minHeight:"100vh"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY,marginBottom:6}}>Library</div>
      <div style={{fontSize:14,color:GRAY,marginBottom:22}}>Every source, in one place.</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {sources.map(s=>(
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:14,background:WHITE,borderRadius:14,padding:"14px 16px",textDecoration:"none",border:`1px solid ${GRAY_L}`}}>
            <div style={{width:44,height:44,borderRadius:10,background:PARCH_D,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:NAVY,marginBottom:2}}>{s.name}</div><div style={{fontSize:12,color:GRAY}}>{s.desc}</div></div>
            <div style={{fontSize:11,fontWeight:700,color:GOLD,background:PARCH_D,padding:"3px 8px",borderRadius:20,flexShrink:0}}>{s.count}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Saved({savedItems}){
  const [folder,setFolder]=useState("All Saved");
  const folders=["All Saved","Sacrament Talk","Jonah Paper","Gospel Doctrine"];
  return(
    <div style={{padding:"60px 20px 100px",background:PARCH,minHeight:"100vh"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY,marginBottom:18}}>Saved</div>
      <div style={{display:"flex",gap:8,marginBottom:20,overflowX:"auto"}}>
        {folders.map(f=><button key={f} onClick={()=>setFolder(f)} style={{padding:"7px 14px",borderRadius:20,border:"none",background:folder===f?NAVY:WHITE,color:folder===f?WHITE:COAL,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{f}</button>)}
        <button style={{padding:"7px 14px",borderRadius:20,background:PARCH_D,color:NAVY,fontSize:12,fontWeight:600,border:"none",cursor:"pointer",whiteSpace:"nowrap"}}>+ New Folder</button>
      </div>
      {savedItems.length===0
        ?<div style={{textAlign:"center",padding:"60px 20px",color:GRAY,fontSize:14,lineHeight:1.8}}><div style={{fontSize:32,marginBottom:12}}>☆</div>Nothing saved yet. Tap ☆ Save on any card.</div>
        :savedItems.map(item=><Card key={item.uid||item.id} item={item}/>)}
    </div>
  );
}

function Topics({sel,setSel}){
  const toggle=t=>setSel(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  return(
    <div style={{padding:"60px 20px 100px",background:PARCH,minHeight:"100vh"}}>
      <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:NAVY,marginBottom:6}}>Your Topics</div>
      <div style={{fontSize:14,color:GRAY,marginBottom:24}}>Flag topics to personalize your feed.</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {TOPICS.map(t=>{const on=sel.includes(t);return(<button key={t} onClick={()=>toggle(t)} style={{padding:"9px 16px",borderRadius:24,background:on?NAVY:WHITE,color:on?GOLD:COAL,fontSize:13,fontWeight:600,border:on?`2px solid ${GOLD}`:`2px solid ${GRAY_L}`,cursor:"pointer"}}>{on?"✓ ":""}{t}</button>);})}
      </div>
      {sel.length>0&&<div style={{marginTop:24,padding:"14px 18px",borderRadius:12,background:WHITE,border:`1px solid ${GRAY_L}`}}><div style={{fontSize:12,color:GRAY,fontWeight:700,marginBottom:6}}>FOLLOWING {sel.length} TOPIC{sel.length>1?"S":""}</div><div style={{fontSize:13,color:COAL}}>New resources will appear in your feed.</div></div>}
    </div>
  );
}

function Profile({sel,savedCount}){
  return(
    <div style={{padding:"60px 20px 100px",background:PARCH,minHeight:"100vh"}}>
      <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY_L} 100%)`,borderRadius:20,padding:"24px 20px",marginBottom:20,textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:GOLD,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:NAVY}}>J</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:WHITE,marginBottom:4}}>Jonah</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.6)"}}>Gospel scholar · Utah</div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:20}}>
        {[{label:"Saved",v:savedCount},{label:"Topics",v:sel.length},{label:"Notes",v:0}].map(s=>(
          <div key={s.label} style={{flex:1,background:WHITE,borderRadius:14,padding:"14px 10px",textAlign:"center",border:`1px solid ${GRAY_L}`}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:NAVY,marginBottom:2}}>{s.v}</div>
            <div style={{fontSize:11,color:GRAY,fontWeight:600}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{background:WHITE,borderRadius:14,overflow:"hidden",border:`1px solid ${GRAY_L}`}}>
        {["My Notes","My Folders","Reading History","Book Recommendations","Settings"].map((item,i,arr)=>(
          <div key={item} style={{padding:"15px 18px",borderBottom:i<arr.length-1?`1px solid ${GRAY_L}`:"none",display:"flex",justifyContent:"space-between",cursor:"pointer"}}>
            <span style={{fontSize:14,color:COAL,fontWeight:500}}>{item}</span>
            <span style={{color:GRAY}}>›</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:20,padding:"14px 18px",borderRadius:14,background:WHITE,border:`1px solid ${GRAY_L}`,textAlign:"center"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:13,color:NAVY,fontStyle:"italic",lineHeight:1.6}}>"The glory of God is intelligence, or in other words, light and truth."</div>
        <div style={{fontSize:11,color:GRAY,marginTop:4}}>D&C 93:36</div>
      </div>
    </div>
  );
}

export default function App(){
  const [tab,setTab]=useState("home");
  const [savedItems,setSavedItems]=useState([]);
  const [sel,setSel]=useState(["Faith","Church History","Old Testament"]);

  const onSave=(id,isSaved,item)=>{
    if(isSaved){if(!savedItems.find(s=>s.id===id))setSavedItems(p=>[...p,{...item,uid:`saved-${id}`}]);}
    else setSavedItems(p=>p.filter(s=>s.id!==id));
  };

  return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:PARCH,fontFamily:"Inter,-apple-system,sans-serif",position:"relative"}}>
      <Styles/>
      {tab==="home"&&<Home onSave={onSave}/>}
      {tab==="library"&&<Library/>}
      {tab==="saved"&&<Saved savedItems={savedItems}/>}
      {tab==="topics"&&<Topics sel={sel} setSel={setSel}/>}
      {tab==="profile"&&<Profile sel={sel} savedCount={savedItems.length}/>}
      <Nav tab={tab} setTab={setTab}/>
    </div>
  );
}