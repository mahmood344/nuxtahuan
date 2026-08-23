export type ToastType='success'|'error'|'warning'|'info'

export type ToastItem={
  id:string
  type:ToastType
  message:string
}

export const useToast=()=>{
  const toasts=useState<ToastItem[]>(
    'app-toasts',
    ()=>[]
  )

  const remove=(id:string)=>{
    toasts.value=
      toasts.value.filter(x=>x.id!==id)
  }

  const show=(
    message:string,
    type:ToastType='info',
    duration=4000
  )=>{
    const id=crypto.randomUUID()

    toasts.value.push({
      id,
      type,
      message
    })

    if(import.meta.client){
      setTimeout(
        ()=>remove(id),
        duration
      )
    }
  }

  return{
    toasts,
    remove,

    success:(message:string)=>
      show(message,'success'),

    error:(message:string)=>
      show(message,'error',6000),

    warning:(message:string)=>
      show(message,'warning',5000),

    info:(message:string)=>
      show(message,'info')
  }
}