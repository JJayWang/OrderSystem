window.onload = function () {
    let meatItems = {
        "food": [{
            id: "F01",
            name: "義大利麵",
            price: 180
        }, {
            id: "F02",
            name: "夏威夷披薩",
            price: 220
        }, {
            id: "F03",
            name: "頂級羊排",
            price: 330
        }],
        "drink": [{}, {}, {}],
        "sweets": [{}, {}, {}]
    };

    let buyCart = [{
        id: "F01",
        count: 5,
        type: "food"
    }];

    let menuType = '';

    refreshPayList();

    let menuItems = document.querySelectorAll(".menu-item");
    let checkPage = document.querySelector(".detail-wrap");
    let seletedData = {};

    if (menuItems && menuItems.length > 0) {
        menuItems.forEach(function (item) {
            item.addEventListener('click', function () {
                menuType = item.getAttribute("data-type");
                let menuDatas = meatItems[menuType];
                if (menuDatas && menuDatas.length > 0) {
                    let menuHtml = '';
                    menuDatas.forEach(function (menu) {
                        menuHtml += `
                            <div id="${menu.id}" class="content-item">
                                <img src="./assets/image/${menuType}/${menu.id}.jpg" alt="">
                                <div class="comment">${menu.name} (${menu.price}元) </div>
                            </div>
                        `;
                    });
                    document.getElementById("menu-container").innerHTML = menuHtml;

                    let itemBtn = document.querySelectorAll(".content-item");
                    if (itemBtn.length > 0) {
                        itemBtn.forEach(function (item) {
                            item.addEventListener('click', function (event) {
                                event.preventDefault();
                                item.classList.add("active");
                                seletedData = menuDatas.find(function (meat) {
                                    return meat.id == item.id;
                                });
                                setDetailInfo({ name: seletedData.name, count: 1 });
                            });
                        });
                    }
                }
            });
        });
        menuItems[0].click();
    }

    let cancelBtn = document.querySelector("#cancel-count");
    cancelBtn.addEventListener('click', function (event) {
        event.preventDefault();
        displayDetailPage(false);
        let itemBtn = document.querySelectorAll(".content-item");
        itemBtn.forEach(function (item) {
            item.classList.remove("active");
        });
    });

    let checkBtn = document.querySelector("#check-count");
    checkBtn.addEventListener('click', function (event) {
        event.preventDefault();
        let meatCount = document.getElementById("detail-count").value * 1;
        let meatData = {
            id: seletedData.id,
            count: meatCount,
            type: menuType
        };

        if (buyCart.length > 0) {
            let meatExist = buyCart.some(function (someItem) {
                return someItem.id === meatData.id;
            });

            if (meatExist) {
                let existMeat = buyCart.find((item) => {
                    return item.id === meatData.id;
                });
                existMeat.count = meatCount;
            }
            else {
                buyCart.push(meatData);
            }
        }
        else {
            buyCart.push(meatData);
        }

        refreshPayList();

        displayDetailPage(false);
        let itemBtn = document.querySelectorAll(".content-item");
        itemBtn.forEach(function (item) {
            item.classList.remove("active");
        });
    });



    function setDetailInfo(data) {
        const detailHeader = document.getElementById("detail-name");
        detailHeader.innerHTML = data.name;
        const detailCount = document.getElementById("detail-count");
        detailCount.value = data.count;
        displayDetailPage(true);
    }

    function displayDetailPage(display) {
        if (checkPage) {
            let attr = 'none';
            if (display) {
                attr = 'block';
            }
            checkPage.style.display = attr;
        }
    }

    function refreshPayList() {
        document.getElementById("pay-container").innerHTML = '';
        if (buyCart && buyCart.length > 0) {
            let html = ``;
            buyCart.forEach((item, index) => {
                let matchMeat = meatItems[item.type].find((meat) => {
                    return meat.id == item.id;
                });

                html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${matchMeat.name}</td>
                    <td>${item.count}</td>
                    <td>${matchMeat.price * item.count}</td>
                    <td>
                        <a href="#" class="update-count" data-id="${item.id}">修</a> /
                        <a href="#" class="delete-meat" data-id="${item.id}">刪</a>
                    </td>
                </tr>`
            });

            document.getElementById("pay-container").innerHTML = html;
            let meatDelete = document.querySelectorAll(".delete-meat");
            if (meatDelete.length > 0) {
                meatDelete.forEach((item) => {
                    item.addEventListener('click', () => {
                        if(confirm("確定要刪除")){
                            buyCart = buyCart.filter((deleteItem) => {
                                return deleteItem.id !== item.getAttribute("data-id");
                            });
                            refreshPayList();
                        }
                        
                    });
                });
            }

            let meatUpdate = document.querySelectorAll(".update-count");
            if (meatUpdate.length > 0) {
                meatUpdate.forEach((item) => {
                    item.addEventListener('click', () => {
                        let updateItem = buyCart.find((payItem)=>{
                            return payItem.id == item.getAttribute("data-id");
                        });

                        if(updateItem){
                            seletedData = meatItems[updateItem.type].find(function (meat) {
                                return meat.id == updateItem.id;
                            });
                        }
                        setDetailInfo({ name: seletedData.name, count: updateItem.count });
                    });
                });
            }
        }
    }
}