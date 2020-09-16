function subtractMinutes(minutes = 0, subject = new Date()) {
  const MS_PER_MINUTE = 60000
  return new Date(subject - minutes * MS_PER_MINUTE)
}

module.exports = {
  subtractMinutes,
}
