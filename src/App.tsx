import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"

function App() {
  const ref = useRef('')
  const changeRef = useRef(false) 
  const changeCountRef = useRef(0)
  const [post, setPost] = useState<string[]>(() => {
    const data = localStorage.getItem("data")
    try{
      if(data) return JSON.parse(data)
      return []
    } catch(e) {
      localStorage.removeItem("data")
      return []
    }
  })
  

  const [content, setContent] = useState<string>(() => {
    const tmp = localStorage.getItem('tmp')
    return tmp ?? ""
  })

  // useEffect(() => {
  //   if(content.length > 0){
  //     localStorage.setItem('tmp', content)
  //   }
  // }, [content])

  useEffect(() => {
    changeCountRef.current++
    ref.current = content;
    changeRef.current = true

    if(changeCountRef.current > 15){
      changeCountRef.current = 0
      changeRef.current = false
      localStorage.setItem('tmp', ref.current)
      console.log('너무 많이 바뀜');
    }
  }, [content])

  useEffect(() => {
    const intv = setInterval(() => {
      console.log('인터벌')
      if(changeRef.current){
        console.log("값이 바뀜", ref.current)
        localStorage.setItem('tmp', ref.current)
        changeRef.current = false
        changeCountRef.current = 0
      }
    }, 5000)

    return () => clearInterval(intv)
  }, [])

  return (
    <div>
      <button onClick={() => {
        if(content.length === 0) return
        setPost(prev => {
          const rs = [...prev, content]
          localStorage.setItem("data", JSON.stringify(rs))
          return rs
        })
        setContent("")
        localStorage.removeItem("tmp")
      }}>
        발행
      </button>
      <button onClick={() => {
        localStorage.removeItem('data')
        setPost([])
      }}>
        초기화
      </button>
      <ReactQuill 
        onChange={setContent}
        value={content}
        modules={{
          toolbar: [
            ["video"],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
          
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
          
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
          
            ['clean']                                         // remove formatting button
          ]
        }}
      />
      {
        post.map((post, i) => (
          <div key={i}>
            <div dangerouslySetInnerHTML={{
              __html: post
            }} />
          </div>
        ))
      }
    </div>
  );
}

export default App;
