import React, { PropsWithChildren } from 'react'
import clsx from 'clsx'

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx('rounded-xl border bg-white shadow-card', className)}>{children}</div>
  )
}

export function CardHeader({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('border-b px-4 py-3 sm:px-6', className)}>{children}</div>
}

export function CardTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <h3 className={clsx('text-base font-semibold', className)}>{children}</h3>
}

export function CardBody({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('px-4 py-4 sm:px-6', className)}>{children}</div>
}

export function CardFooter({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('border-t px-4 py-3 sm:px-6', className)}>{children}</div>
}
