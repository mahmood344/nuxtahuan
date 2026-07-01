export default defineEventHandler(async (event) => {

  const { baseUrl } = useRuntimeConfig()
  console.log(baseUrl , 'baseUrl');
  try {

    const response = await $fetch(`https://api.ahuan.ir/api/BasicInfo/default-airports`, {
      headers: {
        accept: 'application/json'
      }
    })
    console.log(response , baseUrl , 'response');
    return response

  } catch (error) {

    console.error('default airports error:', error)

    return {
      error: true,
      message: 'fetch airports failed'
    }

  }

})