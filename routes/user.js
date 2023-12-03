const express = require('express');
const router = express.Router();

const data = {
    title: "Book List",
    categories:["Book", "Magazine", "Article", "Blog Post"],
    books:[
        {
            id:1,
            name:"Book 1",
            category:"Book",
            description:"Book 1 Description",
            image:"/static/images/book1.jpg",
            homePage:true
        },
        {
            id:2,
            name:"Book 2",
            category:"Book",
            description:"Book 2 Description",
            image:"/static/images/book2.jpg",
            homePage:false
        },
        {
            id:3,
            name:"Book 3",
            category:"Book",
            description:"Book 3 Description",
            image:"/static/images/book3.jpg",
            homePage:true
            
        },
        {
            id:4,
            name:"Book 4",
            category:"Book",
            description:"Book 4 Description",
            image:"/static/images/book4.jpg",
            homePage:true
        },
        {
            id:5,
            name:"Book 5",
            category:"Book",
            description:"Book 5 Description",
            image:"/static/images/book5.jpg",
            homePage:true
        },
    ]
}

router.use("/books/:bookId", (req, res) => {
    res.render( "users/book-details");
  });
  
router.use("/books", (req, res) => {
    res.render( "users/books",data);
  });
  
router.use("/", (req, res) => {
    res.render( "users/index",data);
  });
  

module.exports = router;