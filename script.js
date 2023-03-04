// if we have something in localstorage then go to history page
if (localStorage.getItem("history") != null) {
  window.location.href = "./historyPage.html";
}
// console.log(localStorage.getItem("history"));
// if (localStorage.getItem("history").length > 0) {
//   window.location.href = "./historyPage.html";
// }

const btnEl = document.getElementById("btn");
const bookContainerEl = document.querySelector(".book-container");

//creating an empty array to store the data
let bookHistory = [];

btnEl.addEventListener("click", getBookData);

// async function to fetch the data & show the data in html
async function getBookData(e) {
  e.preventDefault();
  bookContainerEl.innerHTML = "";
  const inputElVal = document.getElementsByTagName("input")[0].value;

  //checking if user searched without any input
  if (inputElVal.length === 0) {
    alert("Please Search Something then Click on Search");
    return;
  }

  //getting the time & date of search
  let date = new Date();
  let AMPM = date.getHours() < 12 ? " AM" : " PM";
  let time =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + AMPM;
  let curDate =
    date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
  let dateAndTime = curDate + " " + time;

  //creating an object
  let bHistory = {
    search: inputElVal,
    date: dateAndTime,
  };

  // checking if localstorage already contains something
  if (localStorage.getItem("history") === null) {
    bookHistory.push(bHistory);
    localStorage.setItem("history", JSON.stringify(bookHistory));
  } else {
    bookHistory = [];
    let a = JSON.parse(localStorage.getItem("history"));
    bookHistory.push(...a, bHistory);
    localStorage.setItem("history", JSON.stringify(bookHistory));
  }
  //setting the book result for with the input data
  document.getElementById("data").innerText = `Book Result for: ${inputElVal}`;

  //fetching the details with the input value
  let URL = `https://www.googleapis.com/books/v1/volumes?q=` + inputElVal;
  const res = await fetch(URL);
  const data = await res.json();
  const books = data.items;

  //mapping over the data & setting in html
  books.forEach((book) => {
    bookContainerEl.innerHTML += `
      <div class="book">
          <img src="${book.volumeInfo.imageLinks?.thumbnail}" alt="" width: "100%"/>
          <p><b>Title: </b> ${book.volumeInfo?.title}</p>
          <p><b>Author:</b> ${book.volumeInfo?.authors}</p>
          <p><b>Page Count:</b> ${book.volumeInfo?.pageCount}</p>
          <p><b>Publisher:</b> ${book.volumeInfo?.publisher}</p>
          <button id = "buy">Buy Now</button>
        </div>

    `;
  });
}
