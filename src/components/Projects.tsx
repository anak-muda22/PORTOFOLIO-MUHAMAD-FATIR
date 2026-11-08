import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { projects, projectCategories } from '../data/projects'
import { Section } from './Sections'
import BrandIcon from './BrandIcon'
export default function Projects(){
  const [cat,setCat]=useState('All'); const list=projects.filter(p=>cat==='All'||p.category===cat)
  const reducedMotion=useReducedMotion()
  return <Section id="projects" title="Selected Projects">
    <div className="projects-toolbar">
      <p><span>CURATED WORK</span>{list.length} PROJECT{list.length===1?'':'S'}</p>
      <label htmlFor="project-category" className="sr-only">Filter projects by category</label>
      <select id="project-category" value={cat} onChange={event=>setCat(event.target.value)} className="px-3 py-2 rounded-md bg-card border border-line text-sm">
        <option value="All">All projects</option>
        {projectCategories.map(category=><option key={category} value={category}>{category}</option>)}
      </select>
    </div>
    <div className="projects-grid">{list.map((p,index)=><motion.article key={p.name} className="project-card" initial={reducedMotion?false:{opacity:0,y:42,rotateY:12,scale:.96}} whileInView={reducedMotion?undefined:{opacity:1,y:0,rotateY:0,scale:1}} viewport={{once:false,amount:.2}} transition={{type:'spring',stiffness:90,damping:18,delay:reducedMotion?0:index*.08}} style={{transformPerspective:900}}>
      <div className="project-thumb">{p.thumb?<img src={p.thumb} alt="" loading="lazy" className="w-full h-full object-cover"/>:<><span className="project-thumb-index">PROJECT / 0{index+1}</span><span className="project-thumb-name">{p.category}</span><i className="project-thumb-orbit"/></>}</div>
      <div className="project-content"><div className="project-meta"><span>{p.category}</span><span className="project-status"><i/>{p.status}</span></div><h3>{p.name}</h3>
      <p className="project-description">{p.description}</p>
      <ul className="project-tech">{p.tech.map(t=><li key={t}><BrandIcon name={t} size={13}/>{t}</li>)}</ul>
      <div className="project-links">{p.github&&<a href={p.github}><Github size={14}/>Code</a>}{p.demo&&<a href={p.demo}><ExternalLink size={14}/>Demo</a>}</div></div></motion.article>)}</div></Section>
}
