export class Helper {
  static firstLetterUppercase(str: string): string {
    str = str.toLowerCase();
    return str
      .split(' ')
      .map((st: string) => `${st.charAt(0).toUpperCase()}${st.slice(1).toLowerCase()}`)
      .join('');
  }
  static lowercase(str: string): string {
    return str.toLowerCase();
  }
  static generateRandomNumber(integerLength: number): number {
    const charecters = '0123456789';

    let result = '';
    const charecterLength = charecters.length;
    for (let i = 0; i < integerLength; i++) {
      result += charecters.charAt(Math.floor(Math.random() * charecterLength));
    }
    return parseInt(result, 10);
  }
  static ParsedData(props: string): any {
    try {
      JSON.parse(props);
    } catch (err) {
      return props;
    }
  }
}
