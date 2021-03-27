// Define post

const posts = [
    {title  :'Post one', body   :'This is post one'},
    {title  :'Post two', body   :'This is post two'}
]

// //Define 2 function. create post and get post.

// function createPost(){
//     setTimeout(function(){
//         posts.push(post);
//     }, 2000);
// };

// function getPost(){
//     setTimeout(function(){
//         let output = '';
//         posts.forEach(function(post) {
//             output += `<li>${post.title}</li>`
//         })
//         document.body.innerHTML = output;
//     }, 1000);
// };

// // call the posts function to create posts.

// createPost({title  :'Post three', body   :'This is post three'})

//get post function

//getPost();


//Define 2 function. create post and get post.

function createPost(post, callback){
    setTimeout(function(){
        posts.push(post);
        callback();
    }, 2000);
};

function getPosts(){
    setTimeout(function(){
        let output = '';
        posts.forEach(function(post) {
            output += `<li>${post.title}</li>`
        })
        document.body.innerHTML = output;
    }, 1000);
};

// call the posts function to create posts.

createPost({title  :'Post three', body   :'This is post three'}, getPosts);