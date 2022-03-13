const http = new easyHTTP
//Do a post request Create a new data..
const data = {
    title   : 'Custom post',
    body    : 'This is a custom post' 
};

//GET
// http.get('https://jsonplaceholder.typicode.com/posts',function(err,post){
    // if(err){
        // console.log(err);
    // }else{
        // console.log(post);
    // }
// })

//POST
// http.post('https://jsonplaceholder.typicode.com/posts', 
// data, function(err, post){
    // if (err){
        // console.log(err);
    // } else {
        // console.log(post);
    // }
// });

//Put request
// http.put('https://jsonplaceholder.typicode.com/posts/1',
// data, function(err, post){
    // if(err){
        // console.log(err);
    // } else {
        // console.log(post);
    // }
// });

//DELETE
http.delete('https://jsonplaceholder.typicode.com/posts/1',function(err,response){
    if(err){
        console.log(err);
    }else{
        console.log(response);
    }
})
