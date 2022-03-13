// Promises explained.
console.log('Promises Practise');

//decalre a post object to reflect real scenario.
const posts = [
    {title : 'Post one', body : 'This is Post one'},
    {title : 'Post two', body : 'This is Post two'}
];

//Create a function for creating Post. This will take 2 min to create the post
function createPost(post){
    return new Promise(function(reslove,reject){
        setTimeout(function(){
            posts.push(post);
            reslove();
        },2000);
    });
}

//Function to get the POST.
function getPosts(){
    setTimeout(function(){
        let output = '';
        posts.forEach(function(post){
            output += `<li>${post.title}</li>`;
        });
        document.body.innerHTML = output;
    },1000)
}

createPost({title : 'Post three', body : 'This is post three'})
.then(getPosts);

