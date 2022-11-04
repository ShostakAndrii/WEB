const firstRow = 'мама мыла раму';
const secondRow = 'собака друг человека';


function getRow(firstRow, secondRow) {
  let firstRowWordCounter = 0;
  let secondRowWordCounter = 0;

  for (let i = 0; i < secondRow.length; i++) {
    if(secondRow.charAt(i) == "а") {
      firstRowWordCounter += 1;
    }
  }

  for (let i = 0; i < secondRow.length; i++) {
    if(secondRow.charAt(i) == "а") {
      secondRowWordCounter += 1;
    }
  }

  if (firstRowWordCounter > secondRowWordCounter){
    console.log(firstRow);
  } else {
    console.log(secondRow);
  }
}
console.log(getRow(firstRow, secondRow));
