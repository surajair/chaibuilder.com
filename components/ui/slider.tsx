'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  onValueCommit?: (value: number[]) => void
  formatValue?: (value: number) => string
  label?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, onValueCommit, formatValue, label, ...props }, ref) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [editValue, setEditValue] = React.useState<string>('')

  const handleValueClick = (
    e: React.MouseEvent,
    index: number,
    value: number
  ) => {
    e.stopPropagation()
    setEditingIndex(index)
    setEditValue(value.toString())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  const handleValueCommit = () => {
    if (editingIndex === null) return

    const newValue = Number(editValue.replace(/[^0-9.-]/g, ''))
    if (isNaN(newValue)) {
      setEditingIndex(null)
      return
    }

    const clampedValue = Math.min(
      Math.max(newValue, props.min || 0),
      props.max || 100
    )

    const newValues = [...(props.value || [])]
    newValues[editingIndex] = clampedValue

    if (editingIndex === 0 && newValues[1] && clampedValue > newValues[1]) {
      newValues[1] = clampedValue
    } else if (
      editingIndex === 1 &&
      newValues[0] &&
      clampedValue < newValues[0]
    ) {
      newValues[0] = clampedValue
    }

    onValueCommit?.(newValues)
    setEditingIndex(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleValueCommit()
    } else if (e.key === 'Escape') {
      setEditingIndex(null)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <label className='text-sm font-medium'>{label}</label>
        <div className='flex items-center gap-2 text-xs text-primary'>
          {props.value?.map((value, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>-</span>}
              {editingIndex === index ? (
                <input
                  type='text'
                  inputMode='numeric'
                  value={editValue}
                  onChange={handleInputChange}
                  onBlur={handleValueCommit}
                  onKeyDown={handleKeyDown}
                  className='w-16 rounded border border-primary/20 px-1 py-0 text-xs focus:border-primary focus:ring-1 focus:ring-primary'
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  onClick={(e) => handleValueClick(e, index, value)}
                  className='cursor-text hover:bg-primary/10 rounded px-1'
                >
                  {formatValue ? formatValue(value) : value}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
          <SliderPrimitive.Range className='absolute h-full bg-primary' />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className='block h-5 w-5 rounded-full border border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' />
        <SliderPrimitive.Thumb className='block h-5 w-5 rounded-full border border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' />
      </SliderPrimitive.Root>
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
