export default defineNuxtPlugin(nuxtApp=>{
  const toast=useToast()

  const checkVpn=async()=>{
    if(!import.meta.client)return

    const key='vpn_warning_shown'

    if(
      sessionStorage.getItem(key)
    ){
      return
    }

    try{
      const response=
        await $fetch(
          'https://api.ipapi.is/'
        )

      console.log(
        'VPN CHECK:',
        response
      )

      const isVpn=
        response?.is_vpn===true

      const isProxy=
        response?.is_proxy===true

      const isTor=
        response?.is_tor===true

      const isDatacenter=
        response?.is_datacenter===true

      if(
        isVpn||
        isProxy||
        isTor||
        isDatacenter
      ){
        toast.warning(
          'برای ارائه خدمات بهتر، لطفاً VPN خود را خاموش کنید.'
        )

        sessionStorage.setItem(
          key,
          '1'
        )
      }

    }catch(error){
      console.error(
        'VPN check error:',
        error
      )
    }
  }

  nuxtApp.hook(
    'app:mounted',
    checkVpn
  )
})