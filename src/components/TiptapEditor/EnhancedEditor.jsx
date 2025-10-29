import * as React from "react"
import { TitleEditor } from "./TitleEditor"
import { TagInput } from "./TagInput"
import "./EnhancedEditor.scss"

export const EnhancedEditor = ({
  initialTitle = "",
  initialTags = [],
  onTitleChange,
  onTagsChange,
  onFocusChange,
  editor,
}) => {
  const [title, setTitle] = React.useState(initialTitle)
  const [tags, setTags] = React.useState(initialTags)
  const containerRef = React.useRef(null)

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle)
    onTitleChange?.(newTitle)
  }

  const handleTagsChange = (newTags) => {
    setTags(newTags)
    onTagsChange?.(newTags)
  }

  // Click handler to focus content editor when clicking on header area
  const handleClick = (e) => {
    // If clicking directly on the header container (empty space below separator)
    if (e.target === containerRef.current || 
        e.target.classList.contains('enhanced-editor-separator')) {
      editor?.commands.focus('end')
    }
  }

  React.useEffect(() => {
    const handleFocusIn = (e) => {
      if (containerRef.current?.contains(e.target)) {
        onFocusChange?.(true)
      }
    }

    const handleFocusOut = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
        onFocusChange?.(false)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('focusin', handleFocusIn)
      container.addEventListener('focusout', handleFocusOut)
    }

    return () => {
      if (container) {
        container.removeEventListener('focusin', handleFocusIn)
        container.removeEventListener('focusout', handleFocusOut)
      }
    }
  }, [onFocusChange])

  return (
    <div className="enhanced-editor-header" ref={containerRef} onClick={handleClick}>
      <TitleEditor initialValue={title} onChange={handleTitleChange} />
      <TagInput tags={tags} onTagsChange={handleTagsChange} />
      <div className="enhanced-editor-separator" />
    </div>
  )
}
