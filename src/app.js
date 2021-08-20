import './css/global.css';
import './css/styles.css';

let pos = {x: null, y: null};
let mouseDown = false;
let selectedItem = null;
let resetTransition = false;
const itemsEle = document.querySelector('.items');

const numOfItems = document.querySelectorAll('.items .item').length;
//Set fixed height of items container
document.querySelector('.items').style.height = (numOfItems * 100) + (numOfItems * 10) + 'px';

function positionItems(insertIndex = null){
    let itemsList = document.querySelectorAll('.items .item'); itemsList = Array.prototype.slice.call(itemsList); itemsList = itemsList.filter(item => item.getAttribute('selected') !== 'yes');
    let indexCounter = 0;
    itemsList.forEach(function(item){
        if(insertIndex === indexCounter + 1){
            indexCounter++;
        }
        item.style.top = (100 * indexCounter) + (indexCounter * 10) + 'px';
        item.setAttribute('order', indexCounter + 1);
        indexCounter++;
    });
}
positionItems();

function positionItemsInOrder(){
    let itemsList = document.querySelectorAll('.items .item'); itemsList = Array.prototype.slice.call(itemsList); 
    itemsList = itemsList.sort(function(a, b){
        return Number(a.getAttribute('order')) > Number(b.getAttribute('order')) ? 1 : -1;
    });
    itemsList.forEach(function(item, index){
        if(item.getAttribute('selected') === 'yes'){
            item.removeAttribute('selected');
            item.style.left = '0';
            setTimeout(function(){
                item.style.zIndex = '0';
            }, 400);
        };
        item.style.top = (100 * index) + (index * 10) + 'px';
        item.setAttribute('order', index + 1);
    });
    resetTransition = true;
    //When transition is over
    setTimeout(function(){
        while(itemsEle.firstChild){
            itemsEle.removeChild(itemsEle.lastChild);
        };
        itemsList.forEach(function(item){
            itemsEle.append(item);
        });
        resetTransition = false;
    }, 400);
}

document.querySelectorAll('.items .item').forEach(function(item, index){
    item.addEventListener('mousedown', function(e){
        if(!pos.x || resetTransition) return;
        mouseDown = true, selectedItem = item;
        let offsetY = (pos.y - itemsEle.offsetTop) - (item.clientHeight / 2), offsetX = (pos.x - itemsEle.offsetLeft) - (item.clientWidth / 2);
        item.style.top = offsetY + 'px';
        item.style.left = offsetX  + 'px';
        item.style.zIndex = '1000';
        item.setAttribute('selected', 'yes');
    });
    item.addEventListener('mouseup', function(e){
        mouseDown = false;
        positionItemsInOrder();
    });
});

addEventListener('mousemove', function(e){
    pos.x = e.clientX, pos.y = e.clientY;
    if(!mouseDown) return;
    let offsetY = (pos.y - itemsEle.offsetTop) - (selectedItem.clientHeight / 2), offsetX = (pos.x - itemsEle.offsetLeft) - (selectedItem.clientWidth / 2);
    selectedItem.style.top = offsetY + 'px';
    selectedItem.style.left = offsetX + 'px';
    let itemsList = document.querySelectorAll('.items .item'); itemsList = Array.prototype.slice.call(itemsList); itemsList = itemsList.filter(item => item.getAttribute('selected') !== 'yes');
    let orderOfSelectedItem = Number(selectedItem.getAttribute('order'));
    //Test for new position
    if(orderOfSelectedItem !== 1){
        let beforeItem = document.querySelector(`.items .item[order*="${orderOfSelectedItem - 1}"]`);
        let beforeMiddle = (pos.y - itemsEle.offsetTop) < beforeItem.offsetTop + (beforeItem.clientHeight / 2);
        if(beforeMiddle){
            positionItems(orderOfSelectedItem - 1);
            selectedItem.setAttribute('order', orderOfSelectedItem - 1);
            return;
        }
    };
    if(orderOfSelectedItem !== document.querySelectorAll('.items .item').length){
        let afterItem = document.querySelector(`.items .item[order*="${orderOfSelectedItem + 1}"]`);
        let afterMiddle = (pos.y - itemsEle.offsetTop) > afterItem.offsetTop + (afterItem.clientHeight / 2);
        if(afterMiddle){
            positionItems(orderOfSelectedItem + 1);
            selectedItem.setAttribute('order', orderOfSelectedItem + 1);
            return;
        }
    };
});