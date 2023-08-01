
export default function shuffleArray(originalArray) {
    const array = [...originalArray]
    for (let i = array.length - 1; i > 0; i--) {
        const randNumber = Date.now() / (1_0000_000_000_000 * Math.random())
        const randomNumber = randNumber > 1 ? randNumber/10 : randNumber
        const j = Math.floor(randomNumber * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
