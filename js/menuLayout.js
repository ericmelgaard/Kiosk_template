"use strict";
//Publisher: Wand Digital
//Date: 09.09.2025
//Version: 60.1
var IMSintegration;
(function (wandDigital) {
    var MenuLayout = (function () {
        function MenuLayout() {
            this.timeOuts = [];
            this.playlist = false;
            this.isRotating = false;
            this.kioskMode = false;
            this.kioskData = null;
            this.currentView = 'landing';
            this.selectedCategory = null;
        }
        MenuLayout.prototype.init = function (IMSItems, IMSProducts, IMSSettings, integrationItems, API) {
            if (!API) {
                return;
            }
            try {
                this.handleSettings(IMSSettings);
            } catch (e) {
                console.error("Error in MenuLayout handleSettings: ", e);
                IMSintegration.Integration.prototype.showConnect(true, "Red", "handleSettings", e, "error");
            }
            try {
                this.injectPricing(IMSProducts);
            } catch (e) {
                console.error("Error in MenuLayout injectPricing: ", e);
                IMSintegration.Integration.prototype.showConnect(true, "Red", "injectPricing", e, "error");
            }
            try {
                this.handleProducts(IMSProducts);
            } catch (e) {
                console.error("Error in MenuLayout handleProducts: ", e);
                IMSintegration.Integration.prototype.showConnect(true, "Red", "handleProducts", e, "error");
            }
            try {
                this.handleLayout(IMSSettings);
            } catch (e) {
                console.error("Error in MenuLayout handleLayout: ", e);
                IMSintegration.Integration.prototype.showConnect(true, "Red", "handleLayout", e, "error");
            }
            try {
                this.fillDynamic(IMSItems, integrationItems);
            } catch (e) {
                console.error("Error in MenuLayout fillDynamic: ", e);
                IMSintegration.Integration.prototype.showConnect(true, "Red", "fillDynamic", e, "error");
            }

            try {
                this.initKioskMode(integrationItems);
            } catch (e) {
                console.error("Error in MenuLayout initKioskMode: ", e);
                IMSintegration.Integration.prototype.showConnect(true, "Red", "initKioskMode", e, "error");
            }

            //optional starts
            try {
                this.rotateEles();
            } catch (e) {
                console.error("Error in MenuLayout rotateEles: ", e);
                IMSintegration.Integration.prototype.showConnect(true, "Red", "rotateEles", e, "error");
            }
            //nutrtion overlay handlers
            //requires adding data objects to each item with nutritionLabelTemplate
            // try {
            //     setupNutritionOverlayHandlers(nutritionLabelTemplate);
            // } catch (e) {
            //     console.error("Error in MenuLayout setupNutritionOverlayHandlers: ", e);
            // }
        };
        MenuLayout.prototype.handleSettings = function (IMSSettings) {
            var _this = this;
            if (!IMSSettings || IMSSettings.length === 0) {
                return;
            }
        };
        MenuLayout.prototype.handleLayout = function (IMSSettings) {
            var _this = this;
            return "did not implement handleLayout";
        };
        MenuLayout.prototype.handleProducts = function (IMSProducts) {
            var _this = this;
            if (!IMSProducts || IMSProducts.length === 0) {
                return;
            }
        };
        MenuLayout.prototype.fillDynamic = function (IMSItems, integrationItems) {
            var _this = this;
            var items = integrationItems.filter(function (item) {return !item.hidden;});
            var itemsByCategory = {};
            items.forEach(function(item) {
                if (!itemsByCategory[item.category]) {
                    itemsByCategory[item.category] = [];
                }
                itemsByCategory[item.category].push(item);
            });
            console.log("Items by category (hidden: false):");
            Object.keys(itemsByCategory).forEach(function(category) {
                console.log("Category: " + category, itemsByCategory[category]);
            });
            //supported for mealTracker || webtrition || IMS || bonAppetit
            // validateItems(IMSItems, mealStation, mealPeriod, menuType)
            // validateItems(integrationItems)
            // integrationItems.forEach(function (each) {
            //     var menuItem = Mustache.to_html(MenuLayout.itemWrapper, each);
            //     $(".asset-wrapper").append(menuItem);
            //    })
            return true;
        };
        MenuLayout.prototype.clearMenuItems = function (zone) {
            var containers = $(zone).get();
            containers.forEach(function (container) {
                while (container.hasChildNodes()) {
                    container.removeChild(container.lastChild);
                }
            });
        };
        MenuLayout.prototype.rotateEles = function () {
            if (this.isRotating) {return;}

            //**rotate menu zones*/
            // rotateZones($("#zone_one"), {
            //     delay: 1,
            //     cycle: 8,
            //     fill: 'packed',
            //     transition: 'fade'
            // });

            //**rotate entire menu section - full screen */
            // rotateMenus("#zone_one", {
            //     delay:0,
            //     cycle: 8,
            //     transition: 'fade'
            // });

            this.isRotating = true;
            return;
        };
        //Date: 02.01.2025 adjusted for new trm playing logic
        MenuLayout.prototype.trmAnimate = function (playing, firstRun) {
            //called with playing each time asset plays in digital client. _this is accessible
            var _this = this;
            //handle first run tasks and non-playlist observer actions
            if (firstRun) {
                //setup observer
                animate();
                $("video").on("ended", animate);
                if (isCF || platform === "windows") {
                    document.reloadAsset = function () { animate(); };
                }
                return;
            }
            //handle playing messages

            if (playing && _this.playlist) {
                //add observer back if removed so video can loop if duration is > video length
                $("video").on("ended", animate)
                animate();
            }
            if (!playing) {
                //clear any observers if asset in a playlist
                $("video").off("ended")
                _this.playlist = true;

                //exiting actions
            }
            //set up aniumation functions
            function clearAllTimeouts() {
                _this.timeOuts.forEach(function (timeout) {
                    clearTimeout(timeout);
                });
            }

            function animate() {
                //simulate video loop
                $('video').each(function () {
                    this.play();
                });

                //playing actions
            }
        };
        MenuLayout.prototype.injectPricing = function (IMSProducts, IMSSettings) {
            var _this = this;
            if (!IMSProducts || IMSProducts.length === 0) {
                return;
            }
            IMSProducts.forEach(function (each) {
                if (each.productId && each.price && each.active) {
                    $(".Cost-" + each.productId).html(each.price);
                    $(".Cost-" + each.productId).attr("title", "PID: " + each.productId);
                    $(".Cost-" + each.productId).addClass(each.ApiSource);
                } else {
                    var error = Mustache.to_html(MenuLayout.error, each);
                    $(".Cost-" + each.productId).html(error);
                    $(".Cost-" + each.productId + " .material-icons").attr("title", "PID: " + each.productId).css("cursor", "wait");
                }
                if (each.productId && each.calorie) {
                    $(".Calories-" + each.productId).html(each.calorie);
                    $(".Calories-" + each.productId).addClass("ims");
                    $(".Calories-" + each.productId).attr("title", "PID: " + each.productId);
                } else {
                    var error = Mustache.to_html(MenuLayout.error, each);
                    $(".Calories-" + each.productId).html(error);
                    $(".Calories-" + each.productId + " .material-icons").attr("title", "PID: " + each.productId).css("cursor", "wait");
                }
                if (each.productId && each.displayName) {
                    $(".Name-" + each.productId).html(each.displayName);
                } else {
                    var error = Mustache.to_html(MenuLayout.error, each);
                    $(".Name-" + each.productId).html(error);
                }
                if (each.productId && each.menuDescription) {
                    $(".Desc-" + each.productId).html(each.menuDescription);
                } else {
                    //do nothing
                }
                if (each.productId && !each.enabled && each.ApiSource) {
                    $(".Cost-" + each.productId).attr("active", "false");
                    $(".Item-" + each.productId).hide();
                } else {
                    $(".Cost-" + each.productId).attr("active", "true");
                    $(".Item-" + each.productId).show();
                }
                if (each.productId && each.outOfStock) {
                    $(".ItemOOS-" + each.productId).css("opacity", "0");
                } else {
                    $(".ItemOOS-" + each.productId).css("opacity", "");
                }
            });
        };
        MenuLayout.COST = '{{dollars}}<span class="cents ">{{cents}}</span>';
        MenuLayout.error = '<span class="material-icons ">error</span>';
        MenuLayout.zoneError = '<div title="{{station}} {{message}}" class="error-wrapper"><svg xmlns="http://www.w3.org/2000/svg" height="{{height}}px" viewBox="0 -960 960 960" width="{{width}}px" fill="{{color}}"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></div>';
        MenuLayout.prototype.initKioskMode = function (integrationItems) {
            var _this = this;

            _this.kioskMode = true;

            if (!integrationItems || integrationItems.length === 0) {
                _this.kioskData = _this.getDemoData();
            } else {
                _this.kioskData = integrationItems;
            }

            $('#kiosk-overlay').show();
            _this.applyKioskProtections();
            _this.renderStationView();
            _this.setupKioskEventHandlers();

            if (typeof InactivityManager !== 'undefined') {
                new InactivityManager(_this);
            }
        };

        MenuLayout.prototype.getDemoData = function () {
            return [
                {
                    name: "Grilled Chicken Sandwich",
                    category: "Grill Station",
                    description: "Juicy grilled chicken breast with lettuce, tomato, and mayo on a toasted bun",
                    price: "$8.99",
                    calories: 520,
                    hidden: false,
                    servingSize: "1 sandwich (285g)",
                    totalFat: 18,
                    saturatedFat: 4,
                    transFat: 0,
                    cholesterol: 95,
                    sodium: 890,
                    totalCarbohydrate: 45,
                    dietaryFiber: 3,
                    totalSugars: 6,
                    addedSugars: 2,
                    protein: 38,
                    vitaminD: 0,
                    calcium: 120,
                    iron: 3,
                    potassium: 480,
                    ingredients: ["Chicken breast", "Wheat bun", "Lettuce", "Tomato", "Mayonnaise", "Salt", "Pepper"],
                    allergens: ["Wheat", "Egg", "Soy"]
                },
                {
                    name: "Classic Cheeseburger",
                    category: "Grill Station",
                    description: "Angus beef patty with American cheese, pickles, onions, ketchup, and mustard",
                    price: "$9.49",
                    calories: 650,
                    hidden: false,
                    servingSize: "1 burger (320g)",
                    totalFat: 32,
                    saturatedFat: 14,
                    transFat: 1,
                    cholesterol: 110,
                    sodium: 1180,
                    totalCarbohydrate: 48,
                    dietaryFiber: 2,
                    totalSugars: 8,
                    addedSugars: 6,
                    protein: 35,
                    vitaminD: 0,
                    calcium: 280,
                    iron: 4,
                    potassium: 420,
                    ingredients: ["Beef patty", "Wheat bun", "American cheese", "Pickles", "Onions", "Ketchup", "Mustard"],
                    allergens: ["Wheat", "Milk", "Soy"]
                },
                {
                    name: "Caesar Salad",
                    category: "Salad Bar",
                    description: "Crisp romaine lettuce with parmesan, croutons, and creamy Caesar dressing",
                    price: "$7.99",
                    calories: 320,
                    hidden: false,
                    servingSize: "1 bowl (245g)",
                    totalFat: 24,
                    saturatedFat: 6,
                    transFat: 0,
                    cholesterol: 35,
                    sodium: 680,
                    totalCarbohydrate: 18,
                    dietaryFiber: 3,
                    totalSugars: 2,
                    addedSugars: 1,
                    protein: 9,
                    vitaminD: 0,
                    calcium: 180,
                    iron: 2,
                    potassium: 340,
                    ingredients: ["Romaine lettuce", "Parmesan cheese", "Croutons", "Caesar dressing", "Lemon juice"],
                    allergens: ["Wheat", "Milk", "Egg", "Fish"]
                },
                {
                    name: "Garden Salad",
                    category: "Salad Bar",
                    description: "Fresh mixed greens with tomatoes, cucumbers, carrots, and your choice of dressing",
                    price: "$6.99",
                    calories: 180,
                    hidden: false,
                    servingSize: "1 bowl (200g)",
                    totalFat: 12,
                    saturatedFat: 2,
                    transFat: 0,
                    cholesterol: 0,
                    sodium: 320,
                    totalCarbohydrate: 14,
                    dietaryFiber: 4,
                    totalSugars: 6,
                    addedSugars: 2,
                    protein: 3,
                    vitaminD: 0,
                    calcium: 80,
                    iron: 1,
                    potassium: 520,
                    ingredients: ["Mixed greens", "Tomatoes", "Cucumbers", "Carrots", "Ranch dressing"],
                    allergens: ["Milk", "Egg"]
                },
                {
                    name: "Pepperoni Pizza",
                    category: "Pizza Station",
                    description: "Hand-tossed pizza with mozzarella cheese and pepperoni",
                    price: "$3.99",
                    calories: 285,
                    hidden: false,
                    servingSize: "2 slices (156g)",
                    totalFat: 12,
                    saturatedFat: 5,
                    transFat: 0,
                    cholesterol: 28,
                    sodium: 720,
                    totalCarbohydrate: 32,
                    dietaryFiber: 2,
                    totalSugars: 4,
                    addedSugars: 2,
                    protein: 13,
                    vitaminD: 0,
                    calcium: 220,
                    iron: 2,
                    potassium: 180,
                    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Pepperoni", "Oregano"],
                    allergens: ["Wheat", "Milk"]
                },
                {
                    name: "Veggie Pizza",
                    category: "Pizza Station",
                    description: "Fresh vegetables on a bed of mozzarella and marinara sauce",
                    price: "$3.49",
                    calories: 245,
                    hidden: false,
                    servingSize: "2 slices (156g)",
                    totalFat: 9,
                    saturatedFat: 4,
                    transFat: 0,
                    cholesterol: 18,
                    sodium: 580,
                    totalCarbohydrate: 34,
                    dietaryFiber: 3,
                    totalSugars: 5,
                    addedSugars: 2,
                    protein: 10,
                    vitaminD: 0,
                    calcium: 200,
                    iron: 2,
                    potassium: 280,
                    ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Bell peppers", "Onions", "Mushrooms", "Olives"],
                    allergens: ["Wheat", "Milk"]
                },
                {
                    name: "Chicken Stir Fry",
                    category: "Asian Station",
                    description: "Tender chicken with mixed vegetables in savory sauce over rice",
                    price: "$8.49",
                    calories: 420,
                    hidden: false,
                    servingSize: "1 serving (340g)",
                    totalFat: 14,
                    saturatedFat: 3,
                    transFat: 0,
                    cholesterol: 75,
                    sodium: 980,
                    totalCarbohydrate: 48,
                    dietaryFiber: 4,
                    totalSugars: 8,
                    addedSugars: 6,
                    protein: 28,
                    vitaminD: 0,
                    calcium: 60,
                    iron: 3,
                    potassium: 620,
                    ingredients: ["Chicken", "Rice", "Broccoli", "Carrots", "Soy sauce", "Garlic", "Ginger"],
                    allergens: ["Soy", "Wheat"]
                },
                {
                    name: "Vegetable Lo Mein",
                    category: "Asian Station",
                    description: "Stir-fried noodles with fresh vegetables in sesame oil",
                    price: "$7.49",
                    calories: 380,
                    hidden: false,
                    servingSize: "1 serving (310g)",
                    totalFat: 11,
                    saturatedFat: 2,
                    transFat: 0,
                    cholesterol: 0,
                    sodium: 840,
                    totalCarbohydrate: 58,
                    dietaryFiber: 5,
                    totalSugars: 6,
                    addedSugars: 4,
                    protein: 12,
                    vitaminD: 0,
                    calcium: 45,
                    iron: 3,
                    potassium: 380,
                    ingredients: ["Lo mein noodles", "Cabbage", "Carrots", "Bean sprouts", "Soy sauce", "Sesame oil"],
                    allergens: ["Wheat", "Soy", "Sesame"]
                }
            ];
        };

        MenuLayout.prototype.applyKioskProtections = function () {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
            });

            document.addEventListener('selectstart', function(e) {
                e.preventDefault();
            });

            document.addEventListener('touchmove', function(e) {
                if (e.scale !== 1) {
                    e.preventDefault();
                }
            }, { passive: false });

            var viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        };

        MenuLayout.prototype.renderStationView = function () {
            var _this = this;
            _this.currentView = 'landing';

            var items = _this.kioskData.filter(function (item) {
                return !item.hidden;
            });

            var itemsByCategory = {};
            items.forEach(function(item) {
                if (!itemsByCategory[item.category]) {
                    itemsByCategory[item.category] = [];
                }
                itemsByCategory[item.category].push(item);
            });

            var stationCards = '';
            Object.keys(itemsByCategory).forEach(function(category) {
                var itemCount = itemsByCategory[category].length;
                var cardData = {
                    category: category,
                    itemCount: itemCount
                };
                stationCards += Mustache.to_html(MenuLayout.stationCardTemplate, cardData);
            });

            $('#kiosk-content').html(`
                <div class="kiosk-welcome-banner">
                    <h1>Welcome to Our Menu</h1>
                    <p>Tap any station below to explore our delicious offerings</p>
                </div>
                <div class="station-grid">
                    ${stationCards}
                </div>
            `);
        };

        MenuLayout.prototype.renderBrowsingView = function (category) {
            var _this = this;
            _this.currentView = 'browsing';
            _this.selectedCategory = category;

            var items = _this.kioskData.filter(function (item) {
                return !item.hidden && item.category === category;
            });

            var menuItemsHtml = '';
            items.forEach(function(item, index) {
                var itemData = Object.assign({}, item, {
                    index: _this.kioskData.indexOf(item)
                });
                menuItemsHtml += Mustache.to_html(MenuLayout.kioskItemTemplate, itemData);
            });

            $('#kiosk-content').html(`
                <div class="kiosk-header">
                    <button class="back-button" id="kiosk-back-btn">← Back to Stations</button>
                    <h1>${category}</h1>
                </div>
                <div class="menu-items-grid">
                    ${menuItemsHtml}
                </div>
                <button class="scroll-top-btn" id="scroll-top-btn">↑</button>
            `);
        };

        MenuLayout.prototype.showNutritionModal = function (item) {
            var _this = this;

            var ingredientsArray = Array.isArray(item.ingredients) ? item.ingredients : (item.ingredients ? [item.ingredients] : []);
            var allergensArray = Array.isArray(item.allergens) ? item.allergens : (item.allergens ? [item.allergens] : []);

            var modalData = {
                name: item.name || item.comboName || item.menuItemName || 'Unknown Item',
                servingSize: item.servingSize || 'Not specified',
                calories: item.calories || 0,
                caloriesFromFat: item.caloriesFromFat || 0,
                totalFat: item.totalFat || 0,
                saturatedFat: item.saturatedFat || 0,
                transFat: item.transFat || 0,
                cholesterol: item.cholesterol || 0,
                sodium: item.sodium || 0,
                totalCarbohydrate: item.totalCarbohydrate || 0,
                dietaryFiber: item.dietaryFiber || 0,
                totalSugars: item.totalSugars || 0,
                addedSugars: item.addedSugars || 0,
                protein: item.protein || 0,
                vitaminD: item.vitaminD || 0,
                calcium: item.calcium || 0,
                iron: item.iron || 0,
                potassium: item.potassium || 0,
                ingredients: ingredientsArray.join(', '),
                allergens: allergensArray.join(', '),
                hasAllergens: allergensArray.length > 0,
                icons: item.icons || []
            };

            if (typeof NutritionReference !== 'undefined') {
                modalData.totalFatDV = NutritionReference.calculateDailyValue('total_fat', item.totalFat);
                modalData.saturatedFatDV = NutritionReference.calculateDailyValue('saturated_fat', item.saturatedFat);
                modalData.cholesterolDV = NutritionReference.calculateDailyValue('cholesterol', item.cholesterol);
                modalData.sodiumDV = NutritionReference.calculateDailyValue('sodium', item.sodium);
                modalData.totalCarbohydrateDV = NutritionReference.calculateDailyValue('total_carbohydrate', item.totalCarbohydrate);
                modalData.dietaryFiberDV = NutritionReference.calculateDailyValue('dietary_fiber', item.dietaryFiber);
                modalData.vitaminDDV = NutritionReference.calculateDailyValue('vitamin_d', item.vitaminD);
                modalData.calciumDV = NutritionReference.calculateDailyValue('calcium', item.calcium);
                modalData.ironDV = NutritionReference.calculateDailyValue('iron', item.iron);
                modalData.potassiumDV = NutritionReference.calculateDailyValue('potassium', item.potassium);
            }

            $('#nutrition-modal').html(Mustache.to_html(MenuLayout.nutritionModalTemplate, modalData));
            $('#nutrition-modal').show();
            _this.setupModalDragging();
        };

        MenuLayout.prototype.setupModalDragging = function () {
            var modal = document.getElementById('nutrition-modal-content');
            if (!modal) return;

            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            var header = modal.querySelector('.nutrition-modal-header');

            if (header) {
                header.onmousedown = dragMouseDown;
                header.ontouchstart = dragTouchStart;
            }

            function dragMouseDown(e) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function dragTouchStart(e) {
                e.preventDefault();
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
                document.ontouchend = closeDragElement;
                document.ontouchmove = elementTouchDrag;
            }

            function elementDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                modal.style.top = (modal.offsetTop - pos2) + "px";
                modal.style.left = (modal.offsetLeft - pos1) + "px";
            }

            function elementTouchDrag(e) {
                e.preventDefault();
                pos1 = pos3 - e.touches[0].clientX;
                pos2 = pos4 - e.touches[0].clientY;
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
                modal.style.top = (modal.offsetTop - pos2) + "px";
                modal.style.left = (modal.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                document.ontouchend = null;
                document.ontouchmove = null;
            }
        };

        MenuLayout.prototype.setupKioskEventHandlers = function () {
            var _this = this;

            $(document).on('click', '.station-card', function() {
                var category = $(this).data('category');
                _this.renderBrowsingView(category);
            });

            $(document).on('click', '#kiosk-back-btn', function() {
                _this.renderStationView();
            });

            $(document).on('click', '.kiosk-menu-item', function() {
                var itemIndex = $(this).data('item-index');
                var item = _this.kioskData[itemIndex];
                if (item) {
                    _this.showNutritionModal(item);
                }
            });

            $(document).on('click', '#nutrition-modal .close-modal', function() {
                $('#nutrition-modal').hide();
            });

            $(document).on('click', '#nutrition-modal', function(e) {
                if (e.target.id === 'nutrition-modal') {
                    $('#nutrition-modal').hide();
                }
            });

            $(document).on('keydown', function(e) {
                if (e.key === 'Escape' && $('#nutrition-modal').is(':visible')) {
                    $('#nutrition-modal').hide();
                }
            });

            $(document).on('click', '#scroll-top-btn', function() {
                $('#kiosk-content').animate({ scrollTop: 0 }, 300);
            });
        };

        MenuLayout.stationCardTemplate = `
        <div class="station-card" data-category="{{category}}">
            <h2>{{category}}</h2>
            <p class="item-count">{{itemCount}} items</p>
        </div>`;

        MenuLayout.kioskItemTemplate = `
        <div class="kiosk-menu-item" data-item-index="{{index}}">
            <div class="item-name">
                {{name}}{{comboName}}{{menuItemName}}
                <div class="item-icons">
                {{#icons}}
                    <img src="./{{fileName}}" class="nutrition-icon" onerror="this.onerror=null;this.remove();">
                {{/icons}}
                </div>
            </div>
            <div class="item-description">{{description}}{{enticingDescription}}{{menuDescription}}</div>
            <div class="item-footer">
                <span class="item-calories">{{calories}} cal</span>
                <span class="item-price">{{price}}</span>
            </div>
        </div>`;

        MenuLayout.nutritionModalTemplate = `
        <div id="nutrition-modal-content">
            <div class="nutrition-modal-header">
                <h2>Nutrition Facts</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="nutrition-label">
                <h3>{{name}}</h3>
                <div class="serving-size">Serving Size: {{servingSize}}</div>
                <div class="calories-section">
                    <div class="calories-line">
                        <span class="calories-label">Calories</span>
                        <span class="calories-value">{{calories}}</span>
                    </div>
                </div>
                <div class="daily-value-header">% Daily Value*</div>
                <div class="nutrient-row">
                    <span><strong>Total Fat</strong> {{totalFat}}g</span>
                    <span><strong>{{totalFatDV}}%</strong></span>
                </div>
                <div class="nutrient-row indent">
                    <span>Saturated Fat {{saturatedFat}}g</span>
                    <span><strong>{{saturatedFatDV}}%</strong></span>
                </div>
                <div class="nutrient-row indent">
                    <span>Trans Fat {{transFat}}g</span>
                    <span></span>
                </div>
                <div class="nutrient-row">
                    <span><strong>Cholesterol</strong> {{cholesterol}}mg</span>
                    <span><strong>{{cholesterolDV}}%</strong></span>
                </div>
                <div class="nutrient-row">
                    <span><strong>Sodium</strong> {{sodium}}mg</span>
                    <span><strong>{{sodiumDV}}%</strong></span>
                </div>
                <div class="nutrient-row">
                    <span><strong>Total Carbohydrate</strong> {{totalCarbohydrate}}g</span>
                    <span><strong>{{totalCarbohydrateDV}}%</strong></span>
                </div>
                <div class="nutrient-row indent">
                    <span>Dietary Fiber {{dietaryFiber}}g</span>
                    <span><strong>{{dietaryFiberDV}}%</strong></span>
                </div>
                <div class="nutrient-row indent">
                    <span>Total Sugars {{totalSugars}}g</span>
                    <span></span>
                </div>
                <div class="nutrient-row indent2">
                    <span>Includes {{addedSugars}}g Added Sugars</span>
                    <span></span>
                </div>
                <div class="nutrient-row">
                    <span><strong>Protein</strong> {{protein}}g</span>
                    <span></span>
                </div>
                <div class="nutrient-row">
                    <span>Vitamin D {{vitaminD}}mcg</span>
                    <span>{{vitaminDDV}}%</span>
                </div>
                <div class="nutrient-row">
                    <span>Calcium {{calcium}}mg</span>
                    <span>{{calciumDV}}%</span>
                </div>
                <div class="nutrient-row">
                    <span>Iron {{iron}}mg</span>
                    <span>{{ironDV}}%</span>
                </div>
                <div class="nutrient-row">
                    <span>Potassium {{potassium}}mg</span>
                    <span>{{potassiumDV}}%</span>
                </div>
                <div class="daily-value-footer">
                    * Percent Daily Values are based on a 2,000 calorie diet.
                </div>
                {{#ingredients}}
                <div class="ingredients-section">
                    <strong>Ingredients:</strong> {{ingredients}}
                </div>
                {{/ingredients}}
                {{#hasAllergens}}
                <div class="allergens-section">
                    <strong>Allergens:</strong> {{allergens}}
                </div>
                {{/hasAllergens}}
                {{#icons}}
                <div class="dietary-icons">
                    {{#icons}}
                    <img src="./{{fileName}}" class="nutrition-icon" onerror="this.onerror=null;this.remove();">
                    {{/icons}}
                </div>
                {{/icons}}
            </div>
        </div>`;

        MenuLayout.itemWrapper = `
        <div class="item-wrapper">
            <div class="menu-item-price-name-wrapper">
                <div class="-menuitem-wrapper">
                    <div class="menu-item-name">
                        <span class="name">{{name}}{{comboName}}{{menuItemName}}
                        {{#icons}}
                            <img src="./{{fileName}}" class="nutrition-icon vegetarian"
                                  onerror="this.onerror=null;this.remove();">
                        {{/icons}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="menu-item-descr {{showDescription}}">{{description}}{{comboItemNames}}{{menuDescription}}</div>
            <div class="price-wrapper">
                <div class="menu-item-portions {{showPortion}}">{{portion}}</div>
                <div class="menu-item-calories">{{calories}} cal</div>
                <div class="menu-item-price {{showPrice}}">{{price}}</div>
            </div>
        </div>`;
        return MenuLayout;
    })();
    IMSintegration.MenuLayout = MenuLayout;
})(IMSintegration || (IMSintegration = {}));
