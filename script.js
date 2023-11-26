function restartGame(){
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    render();
}

const  WINNING_COMBINATIONS  =  [
    [ 0 ,  1 ,  2 ] ,  [ 3 ,  4 ,  5 ] ,  [ 6 ,  7 ,  8 ] ,  // horizontal
    [ 0 ,  3 ,  6 ] ,  [ 1 ,  4 ,  7 ] ,  [ 2 ,  5 ,  8 ] ,  // vertikal
    [ 0 ,  4 ,  8 ] ,  [ 2 ,  4 ,  6 ] ,  // Diagonale
] ;


function init(){
    render();
}


function render() {
    const contentDiv = document.getElementById('content');

    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle'){
            symbol = generateAnimatedCircleSVG();
        } else if(fields[index] === 'cross'){
            symbol = generateAnimatedCrossSVG();
        }
            tableHtml += `<td onclick='handleClick(${index})'>${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    contentDiv.innerHTML = tableHtml;
}

function generateAnimatedCircleSVG() {
    const svghtml = `
        <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="25" fill="transparent" stroke="#00B0ef" stroke-width="5">
                <animate attributeName="r" from="0" to="25" dur="150ms" begin="0s" fill="freeze" />
                <animate attributeName="stroke-dasharray" values="0 157 0 0;157 0 0 0" dur="150ms" begin="0s" fill="freeze" />
            </circle>
        </svg>
    `;
    return svghtml;

}  

function generateAnimatedCrossSVG(){
        const svgHtml = `
    
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
        <line x1="10" y1="10" x2="50" y2="50" stroke="#FFC000" stroke-width="5">
            <animate attributeName="x2" values="50; 60" dur="150ms" begin="0s" repeatCount="1" fill="freeze" />
            <animate attributeName="y2" values="50; 60" dur="150ms" begin="0s" repeatCount="1" fill="freeze" />
        </line>
        <line x1="60" y1="10" x2="50" y2="50" stroke="#FFC000" stroke-width="5">
            <animate attributeName="x2" values="20; 10" dur="150ms" begin="0s" repeatCount="1" fill="freeze" />
            <animate attributeName="y2" values="50; 60" dur="150ms" begin="0s" repeatCount="1" fill="freeze" />
        </line>
    </svg>

    
    
        `;
    
        return svgHtml;
    }
  

    
    function handleClick(index) {
        const currentPlayer = fields.filter(field => field !== null).length % 2 === 0 ? 'circle' : 'cross';
    
        fields[index] = currentPlayer;
    
        const clickedTd = document.querySelector(`[onclick="handleClick(${index})"]`);
        clickedTd.innerHTML = currentPlayer === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
    
        // Entferne das onclick-Attribut, um weitere Klicks zu verhindern
        clickedTd.removeAttribute('onclick');
    
        if  ( isGameFinished ( ) )  {
            const  winCombination  =  getWinningCombination ( ) ;
            drawWinningLine ( winCombination ) ;
        }
        
    }

    function isGameFinished() {
        return fields.every((field) => field !== null) || getWinningCombination() !== null;
    }

    function getWinningCombination() {
        for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
            const [a, b, c] = WINNING_COMBINATIONS[i];
            if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
                return WINNING_COMBINATIONS[i];
            }
        }
        return null;
    }
    

    function drawWinningLine(combination) {
        const lineColor = '#ffffff';
        const lineWidth = 5;
    
        const startCell = document.querySelectorAll(`td`)[combination[0]];
        const endCell = document.querySelectorAll(`td`)[combination[2]];
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
    
        const lineLength = Math.sqrt(
            Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
        );
        const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);
    
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.width = `${lineLength}px`;
        line.style.height = `${lineWidth}px`;
        line.style.backgroundColor = lineColor;
        line.style.top = `${ startRect.top + startRect.height / 2 - lineWidth / 2 } px`;
        line.style.left = `${ startRect.left + startRect.width / 2 } px`;
        line.style.transform = `rotate(${ lineAngle }rad)`;
        document.getElementById('content').appendChild(line);
    }
    
    