
const blogPost = [{"Title" : "Post1",
                  "blog"  : "Vijay"},
                  {"Title" : "Post2",
                  "blog"  : "Athul"},
                  {"Title" : "Post3",
                  "blog"  : "Eshaan"}]

blogPost.forEach(post =>
    console.log(post.Title)
  );

  blogPost.forEach(function(post){
    console.log(post.Title)
  })