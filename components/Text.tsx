'use client'
import React from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'



const Text: React.FC = () => {
    const handleClick = (mode: boolean) => {
        if (mode) {
          toast.success('Success')
        } else {
          toast.error('Failed')
        }
      }
  
    return (
      <Button variant="default" onClick={() => handleClick(false)}>
        Hello
      </Button>
    )
  }

export default Text

