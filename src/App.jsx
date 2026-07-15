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
  {id:22,type:"historic",source:"Historic General Conferences",title:"On the Nature of God",author:"Lorenzo Snow",date:"1893",topic:["Doctrine","Eternal Progression"],url:"https://historicgeneralconferences.weebly.com",excerpt:"As man now is, God once was; as God now is, man may be.",isNew:false},
  {id:23,type:"studies",source:"BYU Studies",title:"The Joseph Smith Papyri and the Book of Abraham",author:"Kerry Muhlestein",date:"2014",topic:["Book of Abraham","Apologetics"],url:"https://byustudies.byu.edu",excerpt:"A careful examination of the Joseph Smith Papyri reveals a sophisticated ancient text consistent with the Book of Abraham.",isNew:true},
  {id:24,type:"devotional",source:"BYU Idaho Devotionals",title:"Learning by Faith",author:"David A. Bednar",date:"2007",topic:["Education","Faith","Revelation"],url:"https://www.byui.edu/devotionals",excerpt:"Learning by faith requires spiritual, mental, and physical exertion and not just passive reception.",isNew:false},
  {id:25,type:"historic",source:"Historic General Conferences",title:"The Keys of the Kingdom",author:"Wilford Woodruff",date:"1889",topic:["Priesthood","Keys","Restoration"],url:"https://historicgeneralconferences.weebly.com",excerpt:"The keys of this dispensation were committed to Joseph Smith and through him to the Twelve Apostles of this Church.",isNew:false},
  {id:26,type:"devotional",source:"BYU Hawaii Devotionals",title:"The Atonement and Our Daily Lives",author:"Tad R. Callister",date:"2015",topic:["Atonement","Discipleship"],url:"https://devotional.byuh.edu",excerpt:"The Atonement is not just for the spiritually wounded — it is the daily bread of the faithful disciple.",isNew:false},
  {id:27,type:"studies",source:"BYU Studies",title:"Wilford Woodruff and the Manifesto",author:"Thomas G. Alexander",date:"1988",topic:["Church History","Revelation"],url:"https://byustudies.byu.edu",excerpt:"An examination of the historical and spiritual circumstances surrounding the 1890 Manifesto ending plural marriage.",isNew:false},
  {id:28,type:"funfact",source:"U.T. Daily",title:"Did You Know?",author:null,date:null,topic:["Church History"],url:null,excerpt:"The Kirtland Temple took three years to build. Saints donated everything they had — some women cut up their finest china to mix into the plaster so it would sparkle in the light.",isNew:false},
  {id:29,type:"devotional",source:"Ensign College Devotionals",title:"Truth and the Educated Mind",author:"Henry B. Eyring",date:"2016",topic:["Education","Truth","Gospel Scholarship"],url:"https://www.ensign.edu/devotionals",excerpt:"Every truth you learn, wherever it comes from, belongs to the gospel of Jesus Christ.",isNew:false},
  {id:30,type:"historic",source:"Historic General Conferences",title:"On Celestial Marriage",author:"Brigham Young",date:"1852",topic:["Church History","Doctrine"],url:"https://historicgeneralconferences.weebly.com",excerpt:"The principle which God has revealed is one of the most glorious principles ever revealed to man.",isNew:false},
];

const TOPICS=["Faith","Church History","Old Testament","Book of Mormon","Doctrine & Covenants","Temple","Atonement","Revelation","Restoration","Holy Ghost","Discipleship","Come Follow Me","Apologetics","Gospel Scholarship","Pearl of Great Price","Christlike Attributes"];
const PAGE=4;

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function getBatch(pool,start){return Array.from({length:PAGE},(_,i)=>({...pool[(start+i)%pool.length],uid:`${pool[(start+i)%pool.length].id}-${start+i}`}));}

const CFM_SCHEDULE=[
  {week:1,dates:"Dec 30–Jan 5",title:"The Restoration of the Fulness of the Gospel",ref:"the-restoration-of-the-fulness-of-the-gospel-of-jesus-christ",excerpt:"We are living in the dispensation of the fulness of times."},
  {week:2,dates:"Jan 6–12",title:"1 Nephi 1–5",ref:"1-nephi-1-5",excerpt:"Lehi's family begins their journey into the wilderness."},
  {week:3,dates:"Jan 13–19",title:"1 Nephi 6–10",ref:"1-nephi-6-10",excerpt:"Lehi's dream of the tree of life."},
  {week:4,dates:"Jan 20–26",title:"1 Nephi 11–15",ref:"1-nephi-11-15",excerpt:"Nephi beholds the vision of the tree of life and the Savior's ministry."},
  {week:5,dates:"Jan 27–Feb 2",title:"1 Nephi 16–22",ref:"1-nephi-16-22",excerpt:"The Liahona guides the family through the wilderness."},
  {week:6,dates:"Feb 3–9",title:"2 Nephi 1–5",ref:"2-nephi-1-5",excerpt:"Lehi's final teachings to his sons."},
  {week:7,dates:"Feb 10–16",title:"2 Nephi 6–10",ref:"2-nephi-6-10",excerpt:"Jacob teaches of the Atonement and the gathering of Israel."},
  {week:8,dates:"Feb 17–23",title:"2 Nephi 11–19",ref:"2-nephi-11-19",excerpt:"Nephi glories in the words of Isaiah."},
  {week:9,dates:"Feb 24–Mar 2",title:"2 Nephi 20–25",ref:"2-nephi-20-25",excerpt:"Isaiah's prophecies of the last days."},
  {week:10,dates:"Mar 3–9",title:"2 Nephi 26–30",ref:"2-nephi-26-30",excerpt:"Nephi prophesies of the Book of Mormon coming forth."},
  {week:11,dates:"Mar 10–16",title:"2 Nephi 31–33",ref:"2-nephi-31-33",excerpt:"The doctrine of Christ — faith, repentance, baptism, the Holy Ghost."},
  {week:12,dates:"Mar 17–23",title:"Jacob 1–4",ref:"jacob-1-4",excerpt:"Jacob teaches the Nephites about chastity and Christ."},
  {week:13,dates:"Mar 24–30",title:"Jacob 5–7",ref:"jacob-5-7",excerpt:"The allegory of the olive tree."},
  {week:14,dates:"Mar 31–Apr 6",title:"Enos–Words of Mormon",ref:"enos-words-of-mormon",excerpt:"Enos wrestles before God in mighty prayer."},
  {week:15,dates:"Apr 7–13",title:"Mosiah 1–3",ref:"mosiah-1-3",excerpt:"King Benjamin delivers his magnificent sermon."},
  {week:16,dates:"Apr 14–20",title:"Mosiah 4–6",ref:"mosiah-4-6",excerpt:"The people of Benjamin enter into a covenant with God."},
  {week:17,dates:"Apr 21–27",title:"Mosiah 7–10",ref:"mosiah-7-10",excerpt:"Ammon discovers the people of Limhi in bondage."},
  {week:18,dates:"Apr 28–May 4",title:"Mosiah 11–17",ref:"mosiah-11-17",excerpt:"Abinadi testifies of Christ before King Noah."},
  {week:19,dates:"May 5–11",title:"Mosiah 18–24",ref:"mosiah-18-24",excerpt:"Alma establishes the church at the waters of Mormon."},
  {week:20,dates:"May 12–18",title:"Mosiah 25–28",ref:"mosiah-25-28",excerpt:"The sons of Mosiah are converted and called to mission."},
  {week:21,dates:"May 19–25",title:"Mosiah 29–Alma 4",ref:"mosiah-29-alma-4",excerpt:"The reign of the judges begins in Zarahemla."},
  {week:22,dates:"May 26–Jun 1",title:"Alma 5–7",ref:"alma-5-7",excerpt:"Alma's great sermon on the mighty change of heart."},
  {week:23,dates:"Jun 2–8",title:"Alma 8–12",ref:"alma-8-12",excerpt:"Alma and Amulek preach in Ammonihah."},
  {week:24,dates:"Jun 9–15",title:"Alma 13–16",ref:"alma-13-16",excerpt:"Alma teaches about the holy priesthood."},
  {week:25,dates:"Jun 16–22",title:"Alma 17–22",ref:"alma-17-22",excerpt:"The sons of Mosiah preach among the Lamanites."},
  {week:26,dates:"Jun 23–29",title:"Alma 23–29",ref:"alma-23-29",excerpt:"The Anti-Nephi-Lehies bury their weapons of war."},
  {week:27,dates:"Jun 30–Jul 6",title:"Alma 30–31",ref:"alma-30-31",excerpt:"Korihor the anti-Christ and the Zoramites."},
  {week:28,dates:"Jul 7–13",title:"Alma 32–35",ref:"alma-32-35",excerpt:"Alma's great sermon on faith and the experiment on the word."},
  {week:29,dates:"Jul 14–20",title:"Alma 36–38",ref:"alma-36-38",excerpt:"Alma's testimony to his sons Helaman and Shiblon."},
  {week:30,dates:"Jul 21–27",title:"Alma 39–42",ref:"alma-39-42",excerpt:"Alma counsels his son Corianton on sin and the Atonement."},
  {week:31,dates:"Jul 28–Aug 3",title:"Alma 43–52",ref:"alma-43-52",excerpt:"Captain Moroni and the title of liberty."},
  {week:32,dates:"Aug 4–10",title:"Alma 53–63",ref:"alma-53-63",excerpt:"The two thousand stripling warriors."},
  {week:33,dates:"Aug 11–17",title:"Helaman 1–6",ref:"helaman-1-6",excerpt:"Secret combinations threaten the Nephite nation."},
  {week:34,dates:"Aug 18–24",title:"Helaman 7–12",ref:"helaman-7-12",excerpt:"Nephi prays on his garden tower."},
  {week:35,dates:"Aug 25–31",title:"Helaman 13–16",ref:"helaman-13-16",excerpt:"Samuel the Lamanite prophesies of Christ's coming."},
  {week:36,dates:"Sep 1–7",title:"3 Nephi 1–7",ref:"3-nephi-1-7",excerpt:"The sign of Christ's birth appears in the Americas."},
  {week:37,dates:"Sep 8–14",title:"3 Nephi 8–11",ref:"3-nephi-8-11",excerpt:"Christ appears to the Nephites after His resurrection."},
  {week:38,dates:"Sep 15–21",title:"3 Nephi 12–16",ref:"3-nephi-12-16",excerpt:"Christ delivers the Sermon on the Mount to the Nephites."},
  {week:39,dates:"Sep 22–28",title:"3 Nephi 17–19",ref:"3-nephi-17-19",excerpt:"Christ heals the sick and institutes the sacrament."},
  {week:40,dates:"Sep 29–Oct 5",title:"3 Nephi 20–26",ref:"3-nephi-20-26",excerpt:"Christ teaches of the gathering of Israel."},
  {week:41,dates:"Oct 6–12",title:"3 Nephi 27–4 Nephi",ref:"3-nephi-27-4-nephi",excerpt:"Christ establishes His church and 200 years of peace follow."},
  {week:42,dates:"Oct 13–19",title:"Mormon 1–6",ref:"mormon-1-6",excerpt:"Mormon abridges the records as the Nephites fall."},
  {week:43,dates:"Oct 20–26",title:"Mormon 7–9",ref:"mormon-7-9",excerpt:"Moroni's farewell and his father's final testimony."},
  {week:44,dates:"Oct 27–Nov 2",title:"Ether 1–5",ref:"ether-1-5",excerpt:"The brother of Jared sees the premortal Christ."},
  {week:45,dates:"Nov 3–9",title:"Ether 6–11",ref:"ether-6-11",excerpt:"The Jaredites cross the ocean to the promised land."},
  {week:46,dates:"Nov 10–16",title:"Ether 12–15",ref:"ether-12-15",excerpt:"Moroni's great discourse on faith, hope, and charity."},
  {week:47,dates:"Nov 17–23",title:"Moroni 1–6",ref:"moroni-1-6",excerpt:"Moroni records the ordinances of the church."},
  {week:48,dates:"Nov 24–30",title:"Moroni 7–9",ref:"moroni-7-9",excerpt:"Mormon's sermon on faith, hope, and charity."},
  {week:49,dates:"Dec 1–7",title:"Moroni 10",ref:"moroni-10",excerpt:"By the power of the Holy Ghost ye may know the truth of all things."},
  {week:50,dates:"Dec 8–14",title:"Christmas — Behold, Your King",ref:"christmas",excerpt:"Celebrating the birth of Jesus Christ."},
  {week:51,dates:"Dec 15–21",title:"Christmas — He Shall Be Called Jesus Christ",ref:"christmas",excerpt:"Rejoicing in the gift of the Savior."},
  {week:52,dates:"Dec 22–28",title:"Christmas — Joy to the World",ref:"christmas",excerpt:"The Savior is born — the greatest gift to mankind."},
];

function getCurrentCFM(){
  const now=new Date();
  const start=new Date(now.getFullYear(),0,1);
  const day=Math.floor((now-start)/(1000*60*60*24));
  const week=Math.floor(day/7);
  const lesson=CFM_SCHEDULE[Math.min(week,CFM_SCHEDULE.length-1)];
  const url=`https://www.churchofjesuschrist.org/study/come-follow-me/book-of-mormon/${lesson.ref}?lang=eng`;
  return{...lesson,url};
}

function CFMBanner(){
  const lesson=getCurrentCFM();
  return(
    <div style={{background:`linear-gradient(135deg,${NAVY} 0%,${NAVY_L} 100%)`,borderRadius:16,padding:"16px 18px",marginBottom:16,border:"1px solid rgba(201,168,76,.3)"}}>
      <div style={{fontSize:10,color:GOLD,fontWeight:700,letterSpacing:1.5,marginBottom:4}}>COME FOLLOW ME · THIS WEEK</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginBottom:6}}>{lesson.dates}</div>
      <div style={{fontFamily:"Georgia,serif",fontSize:17,color:WHITE,fontWeight:700,marginBottom:4}}>{lesson.title}</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,.65)",marginBottom:12,lineHeight:1.5}}>{lesson.excerpt}</div>
      <a href={lesson.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"7px 16px",borderRadius:8,background:GOLD,color:NAVY,fontSize:12,fontWeight:700,textDecoration:"none"}}>Read This Week's Lesson →</a>
    </div>
  );
}

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
      {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:tab===t.id?GOLD:GRAY,padding:"0 12px"}}><span style={{fontSize:20}}>{t.icon}</span><span style={{fontSize:10,fontWeight:600}}>{t.label}</span></button>))}
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
        <CFMBanner/>
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
        {sources.map(s=>(<a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:14,background:WHITE,borderRadius:14,padding:"14px 16px",textDecoration:"none",border:`1px solid ${GRAY_L}`}}><div style={{width:44,height:44,borderRadius:10,background:PARCH_D,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{s.icon}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:NAVY,marginBottom:2}}>{s.name}</div><div style={{fontSize:12,color:GRAY}}>{s.desc}</div></div><div style={{fontSize:11,fontWeight:700,color:GOLD,background:PARCH_D,padding:"3px 8px",borderRadius:20,flexShrink:0}}>{s.count}</div></a>))}
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
        {[{label:"Saved",v:savedCount},{label:"Topics",v:sel.length},{label:"Notes",v:0}].map(s=>(<div key={s.label} style={{flex:1,background:WHITE,borderRadius:14,padding:"14px 10px",textAlign:"center",border:`1px solid ${GRAY_L}`}}><div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:NAVY,marginBottom:2}}>{s.v}</div><div style={{fontSize:11,color:GRAY,fontWeight:600}}>{s.label}</div></div>))}
      </div>
      <div style={{background:WHITE,borderRadius:14,overflow:"hidden",border:`1px solid ${GRAY_L}`}}>
        {["My Notes","My Folders","Reading History","Book Recommendations","Settings"].map((item,i,arr)=>(<div key={item} style={{padding:"15px 18px",borderBottom:i<arr.length-1?`1px solid ${GRAY_L}`:"none",display:"flex",justifyContent:"space-between",cursor:"pointer"}}><span style={{fontSize:14,color:COAL,fontWeight:500}}>{item}</span><span style={{color:GRAY}}>›</span></div>))}
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