const toUpp = (str) => {
return str.charAt(0).toUpperCase() + str.slice(1);
}
 let s = "hello"
console.log(toUpp(s))
const arr = [1 ,5, 6 ,3 ,4 ,6 ,2,3];
// let left = 0 
// for(let i = 1; i < arr.length;i++){
//     if(arr[left] === arr[right]){
//         arr[left] = arr[left + 1]
//     }
// }
const unique = []

for(let i of arr) if(unique.indexOf(i) === -1) unique.push(i)
console.log(unique)
const me = "i am laloo and laloo is great laloo is honest laloo is best"
const mecpoy = me.split("laloo").join("Lelisa")
console.log(me ,"\n" ,mecpoy)

// function* generator(i){
//     yield i
//     yield i + 10

// }
// console.log(generator(10).next().value)
// console.log(generator(10).next().value)

const arr1 = [];
console.log(arr1.reduce((a ,b) => a + b, 0)
)

const arr2 = [6 ,3]
const obj = {sum : arr2[0] + arr2[1] , diff : arr2[0] - arr2[1]}
console.log(obj)

function abc(a , c){
    return ({me : a + c,you: a- c})
}
console.log(abc(null , 6))

