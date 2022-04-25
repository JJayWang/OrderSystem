window.onload = function () {
    let meatItems = {
        "food":[{
            id:"F01",
            name:"義大利麵",
            price:180
        },{
            id:"F02",
            name:"夏威夷披薩",
            price:220
        },{
            id:"F03",
            name:"頂級牛排",
            price:330
        }],
        "drink":[{},{},{}],
        "sweets":[{},{},{}]
    };

    let menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(function(item){
        item.addEventListener('click',function(){
            let menuType = item.getAttribute("data-type");
            let menuDatas = meatItems[menuType];
            if(menuDatas && menuDatas.length > 0) {
                let menuHtml = '';
                menuDatas.forEach(function(menu){
                    menuHtml += `
                        <div class="content-item">
                            <img src="./assets/image/${menuType}/${menu.id}.jpg" alt="">
                            <div class="comment">${menu.name}</div>
                        </div>
                    `;
                });
                document.getElementById("menu-container").innerHTML = menuHtml;
            }
        });
    });




    let itemBtn = document.querySelectorAll(".content-item");
    let checkPage = document.querySelector(".detail-wrap");
    if (itemBtn.length > 0) {
        itemBtn.forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                checkPage.style.display = "block"
                item.classList.add("active");
            });
        });
    }


    let cancelBtn = document.querySelector("#cancel-count");
    cancelBtn.addEventListener('click', function (event) {
        event.preventDefault();
        checkPage.style.display = "none"
        itemBtn.forEach(function (item) {
            item.classList.remove("active");
        });
    });
}