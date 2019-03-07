RegistrationEnum = {"NOT_REGISTERED":0, "REGISTIRING":1, "REGISTERED":2}
Object.freeze(RegistrationEnum)

console.log("Burada: " + RegistrationEnum.NOT_REGISTERED)

module.exports.Enum = RegistrationEnum;