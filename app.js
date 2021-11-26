document.addEventListener('DOMContentLoaded',()=>{
    const grid = document.querySelector('.grid');
    const scodeDisplay = document.getElementById('score');
    const moveDisplay = document.getElementById('moves');
    const width = 8;
    const squares = [];
    let score = 0;
    let move = 53;

    const colors=[
        'url(images/blue.png)', 
        'url(images/green.png)',
        'url(images/pink.png)',
        'url(images/violet.png)',
        'url(images/yellow.png)'
    ];
    //create board
    function createBoard(){
        for(let i=0; i<width*width; i++){
            //create div element
            const sq = document.createElement('div'); 
            //making ech sq dragable
            sq.setAttribute('draggable',true);
            //giving id to each sq
            sq.setAttribute('id',i);
            //Generate a random color with round number
            let randomColor = Math.floor(Math.random() * colors.length); 
            //Styling each div with random color
            sq.style.backgroundImage = colors[randomColor];
            // put sq into a div
            grid.appendChild(sq);
            //store in an array to work with
            squares.push(sq); 
        }
    }
    createBoard();

    //Draggable feature
    let draggedColor; //colorBeingDragged
    let replacedColor; //colorBeingReplaced
    let draggedId;   //squareIDBeingDragged
    let replacedId; //squareIDBeingReplaced    

    //Attach event listener to each sq on grid--listening to each stage of dragging
    squares.forEach(sq =>sq.addEventListener('dragstart',dragStart));
    squares.forEach(sq =>sq.addEventListener('dragend',dragEnd));
    squares.forEach(sq =>sq.addEventListener('dragover',dragOver));
    squares.forEach(sq =>sq.addEventListener('dragenter',dragEnter));
    squares.forEach(sq =>sq.addEventListener('dragleave',dragLeave));  
    squares.forEach(sq =>sq.addEventListener('drop',dragDrop));

    function dragStart(){
    //storing dragged color information
        //storing dragged color
        draggedColor = this.style.backgroundImage;
        //storing dragged color id
        draggedId = parseInt(this.id);//converting string to int
    }
    function dragDrop(){
    //swaping colors    
        //storing the original sq color.
        replacedColor = this.style.backgroundImage;
        //storing original sq id
        replacedId = parseInt(this.id); //converting string to int
        //changing sq color to draggedColor
        this.style.backgroundImage = draggedColor;
        //giving orginal sq replaced color
        squares[draggedId].style.backgroundImage = replacedColor ;     
    }
    function dragOver(e){
        e.preventDefault();
    }
    function dragEnd(){
    //Checking for valid moves    
        let validMoves = [
            draggedId - 1,//switch between two consecutive ids
            draggedId + 1, 
            draggedId - width, //switch between two rows - top and bottom
            draggedId + width
        ];
        //storing a valid move 
        let vaildMove = validMoves.includes(replacedId);
        //if replacedId exist and is a valid move 
        if(replacedId && vaildMove){
            //empty replaceID
            replacedId = null; 
            move -= 1 ; 
            moveDisplay.innerHTML = move;
            if(move == 0){
                alert("Game Over!");
                location.reload();
            }
        }
        //replacedId exist but is a invalid move 
        else if(replacedId && !vaildMove){
            //give sq its orginal color back
            squares[replacedId].style.backgroundImage = replacedColor;
            squares[draggedId].style.backgroundImage = draggedColor;
        }
        //if no replacedId and is invalid move
        else {
            squares[draggedId].style.backgroundImage = draggedColor;
        }
    }  
    function dragEnter(e){
        e.preventDefault();
    }
    function dragLeave(){
        
    }
    //Droping new colors in empty spaces 
    function newColorDrop(){ //move Down
        for (i=0; i<55; i++){  
            //checking first seven rows - check sq below each of the indexes for empty sq
            if(squares[i+width].style.backgroundImage === ''){
            //all the empty space will make top of the page
                //Giving sq background color to it
                squares[i+width].style.backgroundImage = squares[i].style.backgroundImage;
                //make sq empty 
                squares[i].style.backgroundImage = '';
            //filling top row with new color
        /**** this is not working */
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                //console.log(isFirstRow);
                //if top row is empty, fill color               
                if(isFirstRow !== false && squares[i].style.backgroundImage === ''){
                    let randomColor = Math.floor(Math.random()* colors.length);
                    //assigning new colors
                    squares[i].style.backgroundImage = colors[randomColor];
                }
            }
        }
    }

    //Checking for matches
    //Rows
    function checkRowForThreeMatch(){     
        for(i= 0; i < 61; i++){  
            let row = [i, i+1, i+2]; //rowOfThree
            //store first color in a row
            let RowColor = squares[i].style.backgroundImage; //decidedColor
            //Defining black space 
            const blankSpace = squares[i].style.backgroundImage === ''; //isBlank
            //Check for valid move for broken rows - rows to not start at end of grid
            //width-2,width-1,width*2-2,width*2-1,width*3-2,width*3-1...with*7-2,width*7-1
            const notVaidIds = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];

            // if i in included in notVaidIds array skip it
            if(notVaidIds.includes(i)) continue;
            
            //if every color in row is same 
            if(row.every(index => squares[index].style.backgroundImage === RowColor && ! blankSpace)){
                score += 3; 
                scodeDisplay.innerHTML = score;
                //make all three empty color.
                row.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });       
            }
        }
    }
    checkRowForThreeMatch();

    //Column
    function checkColumnForThreeMatch(){
        for(i= 0; i < 47; i++){
            let Column = [i, i+width, i+width*2]; //ColumnOfThree
            //store first color in a Column
            let ColumnColor = squares[i].style.backgroundImage; //decidedColor
            //Defining black space
            const blankSpace = squares[i].style.backgroundImage === ''; //isBlank
            //if every color in Column is same 
            if(Column.every(index => squares[index].style.backgroundImage === ColumnColor && ! blankSpace)){
                score += 3; 
                scodeDisplay.innerHTML = score;
                //make all three empty color.
                Column.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });       
            }
        }
    }
    checkColumnForThreeMatch();

    //invoking checkRowForThreeMatch for every 100 ms
    window.setInterval(function(){
        newColorDrop();
        checkRowForThreeMatch();
        checkColumnForThreeMatch();
    },100)

});