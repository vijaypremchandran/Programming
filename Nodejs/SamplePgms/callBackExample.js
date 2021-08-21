const compute = (n1, n2, callback) => callback(n1,n2);
const sum = (n1,n2) => n1 + n2;
const product = (n1,n2) => n1 * n2;

console.log(compute(5, 3, sum));
console.log(compute(5, 3, product));