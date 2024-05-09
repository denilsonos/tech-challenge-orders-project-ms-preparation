export const cpfValidator = (cpf: string): boolean => {

    if (cpf == null) {
        return true;
    }

    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let mod = sum % 11;
    const digit1 = mod < 2 ? 0 : 11 - mod;

    if (parseInt(cpf.charAt(9)) !== digit1) {
        return false;
    }

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

    mod = sum % 11;
    const digit2 = mod < 2 ? 0 : 11 - mod;

    if (parseInt(cpf.charAt(10)) !== digit2) {
        return false;
    }

    return true;
}
