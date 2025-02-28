const handlerError = (error, message, statusCode) => {
    console.log(message, error)
    return {
      statusCode: statusCode,
      body: JSON.stringify({
        message: message,
        error: error.details
      })
    }
  }