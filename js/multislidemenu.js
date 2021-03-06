(function ($, window, document, undefined) {
    $.multiSlideMenu = function (el, options) {
        var pluginName = "SlideMenu", base = this, element = el;
        base._addCssNamespace = function (attrNames, namespace) {
            var obj = {};
            $.each(attrNames, function (k, v) {
                if (typeof v === "string") {
                    obj[k] = namespace + pluginName + v;
                }
            });
            return obj;
        };
        base._setup = function () {
            base.o = $.extend({}, $.multiSlideMenu.defaults, options);
            base.o.classNames = base._addCssNamespace(base.o.classNames, base.o.namespace);
            base.$multiSlideMenu = $(el);
            base.$multiSlideMenu.data(pluginName, base);
            base.$backs = [];
            base.$items = base.$multiSlideMenu.find(base.o.itemSelector);
            base.$multiSlideMenu.addClass(base.o.classNames.navigationClass);
            base.$movable = $("<div/>", {"class": base.o.classNames.wrapperClass});
            base.$inheritedMenus = base.$multiSlideMenu.find(base.o.menuSelector);
            base.$rootMenu = $(base.$inheritedMenus.splice(0, 1));
            base.$rootMenu.addClass(base.o.classNames.allMenusClass).appendTo(base.$movable.prependTo(base.$multiSlideMenu));
            base.$inheritedMenus.addClass(base.o.classNames.allMenusClass + " " + base.o.classNames.inheritedMenuClass);
            var menu_item_tagname = base.$items.prop("tagName");
            base.$inheritedMenus.each(function (i, val) {
                var url = $(val).closest(base.o.itemSelector).children("a").attr("href"), $li = $("<" + menu_item_tagname + "/>", {"class": base.o.classNames.menuItemBackClass});
                if (base.o.backOnTop) {
                    $li.prependTo($(val));
                } else {
                    $li.appendTo($(val));
                }
                base.$backs.push($li.append($("<a>", {href: url}).html(base.o.backLinkContent)));
            });
            if (base.o.minHeightMenu > 0) {
                base.o.minHeightMenu = base.o.minHeightMenu > base.$multiSlideMenu.height() ? base.o.minHeightMenu : base.$multiSlideMenu.height();
                base.$multiSlideMenu.css("min-height", base.o.minHeightMenu);
            }
            base.o.previousHeight = 0;
            base.o.nowSliding = false;
        };
        base.gotoSelected = function (depth, animate) {
            base._hideOtherMenus(depth, base._scrollToTop);
            base._heightFix(depth);
            base._animateSlide(depth, animate);
        };
        base._animateSlide = function (depth, animate) {
            var amount = Math.abs(depth * 100), callback_slide = depth > 0 ? base.o.onSlideForward : base.o.onSlideBack;
            if (callback_slide && typeof(callback_slide) === "function") {
                callback_slide(base);
            }
            if (animate) {
                base.o.nowSliding = true;
                base.$movable.animate({left: depth > 0 ? "-=" + amount + "%" : "+=" + amount + "%"}, base.o.slideSpeed, base.o.slideEasing, function () {
                    base.o.nowSliding = false;
                    base._scrollToTop(depth);
                    if (base.o.afterSlide && typeof(base.o.afterSlide) === "function") {
                        base.o.afterSlide(base);
                    }
                });
            } else {
                base.$movable.css("left", "-" + amount + "%");
            }
        };
        base._scrollToTop = function (depth) {
            var $menu_children = base.$currentMenuElement.children(base.o.menuSelector), back_link = base.$currentMenuElement.hasClass(base.o.classNames.menuItemBackClass) ? true : false;
            if (base.o.scrollToTopSpeed && (back_link || $menu_children.length > 0)) {
                var $back = depth > 0 ? $menu_children.children(base.o.itemSelector).last() : base.$currentMenuElement, $offset_elem = depth > 0 ? $back.closest(base.o.menuSelector) : base.$currentMenuElement, back_pos_top = $back.offset().top, win_pos_top = $(window).scrollTop();
                if (back_pos_top - win_pos_top < 0) {
                    $("html, body").animate({scrollTop: $offset_elem.offset().top}, base.o.scrollToTopSpeed);
                }
            }
        };
        base._heightFix = function (depth) {
            if (base.o.autoHeightMenu) {
                var h = 0, to_currentmenuelement_h = 0;
                if (depth > 0) {
                    to_currentmenuelement_h = (base.$currentMenuElement.offset().top - base.$multiSlideMenu.offset().top) + base.$currentMenuElement.outerHeight();
                    h = base.$currentMenuElement.children(base.o.menuSelector).height();
                    //h = h < to_currentmenuelement_h ? h = to_currentmenuelement_h : h;
                } else {
                    h = base.$currentMenuElement.closest(base.o.menuSelector).height();
                }
                if (depth < 0) {
                    h = h > base.o.previousHeight ? h : base.o.previousHeight;
                }
                h = h > base.o.minHeightMenu ? h : base.o.minHeightMenu;
                base.o.previousHeight = h;
                base.$multiSlideMenu.css("height", h);
            }
        };
        base._hideOtherMenus = function (depth) {
            var $branchParent = base.$currentMenuElement.parentsUntil("." + base.o.classNames.navigationClass).filter(base.o.itemSelector);
            $branchParent.push(base.$currentMenuElement[0]);
            if (depth > 0) {
                base.$inheritedMenus.css("visibility", "hidden");
                $branchParent.children(base.o.menuSelector).css("visibility", "visible");
            }
        };
        base.loadContent = function (loadContainer, url) {
            var loading = $("<span/>", {"class": base.o.classNames.loadingClass}).html("&nbsp;"), clear = '<div style="clear:both"></div>', glue = "?";
            if (base.o.loadContainer.length > 0 && loadContainer.length > 0 && $.inArray(url, base.o.excludeUri) < 0 && (location.origin + url) !== window.location.href) {
                if (base.o.beforeLoad && typeof(base.o.beforeLoad) === "function") {
                    base.o.beforeLoad.apply(loadContainer);
                } else {
                    var loadIn = function () {
                        var cuttedPath = window.location.pathname.split("/");
                        switch (cuttedPath[1]) {
                            case "register":
                            case "cart":
                            case "auxpage_divoland":
                            case "auxpage_mixtoys":
                            case "auxpage_dreamtoys":
                            case "auxpage_grandtoys":
                            case "auxpage_kindermarket":
                                return "";
                            default:
                                return loadContainer;
                        }
                    };
                    loadContainer = loadIn();
                    if (!loadContainer) {
                        location.href = url;
                        return;
                    } else {
                        loadContainer.addClass("loader");
                    }
                }
                if (strpos(url, "?") !== false) {
                    glue = "&";
                }
                $.ajax({url: url + glue + "ajax=1", type: "get"}).done(function (data) {
                    loadContainer.html(data).removeClass("loader");
                    base.changeTitle();
                    base.changeUri(url);
                    if (base.o.afterLoadDone && typeof(base.o.afterLoadDone) === "function") {
                        base.o.afterLoadDone.apply(loadContainer);
                    }
                    base.$multiSlideMenu.trigger("afterLoadDone." + base.o.namespace + pluginName);
                }).fail(function () {
                    base.$currentMenuElement.siblings().children("." + base.o.classNames.menuItemBackClass).trigger("click");
                    if (base.o.afterLoadFail && typeof(base.o.afterLoadFail) === "function") {
                        base.o.afterLoadFail.apply(loadContainer);
                    }
                    base.$multiSlideMenu.trigger("afterLoadFail." + base.o.namespace + pluginName);
                }).always(function () {
                    if (base.o.afterLoadAlways && typeof(base.o.afterLoadAlways) === "function") {
                        base.o.afterLoadAlways.apply(loadContainer);
                    }
                    base.$multiSlideMenu.trigger("afterLoadAlways." + base.o.namespace + pluginName);
                });
            }
        };
        base.changeTitle = function () {
            if (base.o.setTitle) {
                $("title").text(base.$currentMenuElement.children("a").text());
            }
        };
        base.changeUri = function (url) {
            // if (!!(window.history && history.pushState)) {
            //     window.history.pushState({}, "", url);
            // }
            if (url != window.location) {
                window.history.pushState(null, null, url);
            }
        };
        base._menuItemClicked = function (element, event, depth) {
            event.preventDefault();
            event.stopPropagation();
            if (base.o.nowSliding) {
                return false;
            }
            base.$currentMenuElement = $(element).parent(base.o.itemSelector);
            var url = $(element).attr("href"), $menu_children = base.$currentMenuElement.children(base.o.menuSelector), back_link = base.$currentMenuElement.hasClass(base.o.classNames.menuItemBackClass) ? true : false, $load_container = $(base.o.loadContainer);
            base.$multiSlideMenu.find(base.o.itemSelector).filter("." + base.o.selectedClass).removeClass(base.o.selectedClass);
            if (back_link) {
                base.$currentMenuElement = base.$currentMenuElement.closest(base.o.menuSelector).closest(base.o.itemSelector);
            }
            base.$currentMenuElement.addClass(base.o.selectedClass);
            if (base.o.loadOnlyLatest === false) {
                base.loadContent($load_container, url);
            } else {
                if (base.o.loadOnlyLatest && $menu_children.length === 0 && depth > 0) {
                    base.loadContent($load_container, url);
                }
            }
            if ($menu_children.length === 0 && depth > 0) {
                if (base.o.onLatestClick && typeof(base.o.onLatestClick) === "function") {
                    base.o.onLatestClick.apply(element);
                }
                base.$multiSlideMenu.trigger("onLatestClick." + base.o.namespace + pluginName);
            }
            if ($menu_children.length > 0 || depth < 0) {
                base.gotoSelected(depth, true);
            }
        };
        base._menuDown = function (e) {
            base._menuItemClicked(this, e, 1);
        };
        base._menuUp = function (e) {
            base._menuItemClicked(this, e, -1);
        };
        base._remove = function () {
            base.$items.off("click", "a", base._menuDown);
            base.$multiSlideMenu.removeClass(base.o.classNames.navigationClass);
            if (base.o.autoHeightMenu) {
                base.$multiSlideMenu.css("height", "initial");
            }
            if (base.o.minHeightMenu > 0) {
                base.$multiSlideMenu.css("min-height", "initial");
            }
            base.$rootMenu.removeClass(base.o.classNames.allMenusClass).prependTo(base.$multiSlideMenu);
            base.$inheritedMenus.removeClass(base.o.classNames.allMenusClass + " " + base.o.classNames.inheritedMenuClass);
            base.$inheritedMenus.css("visibility", "");
            $.each(base.$backs, function (index, back) {
                back.remove();
            });
            base.$movable.remove();
            base.$multiSlideMenu.removeData(pluginName);
        };
        base.exec = function (func) {
            if (base.hasOwnProperty(func) && typeof base[func] === "function") {
                base[func].call();
            }
        };
        base.destroy = function () {
            base._remove();
        };
        base.init = function () {
            base._setup();
            $.each(base.$backs, function (index, back) {
                back.on("click", "a", base._menuUp);
            });
            base.$items.on("click", "a", base._menuDown);
            if (!!(window.history && history.pushState)) {
                window.onpopstate = function (event) {
                    if (event && event.state) {
                        location.reload();
                    }
                };
            }
            var $selectedItem = base.$multiSlideMenu.find("." + base.o.selectedClass).first();
            if ($selectedItem.length) {
                base.$currentMenuElement = $selectedItem;
                var $url = base.$currentMenuElement.children("a").first(), depth = $selectedItem.parentsUntil("." + base.o.classNames.navigationClass).filter(base.o.itemSelector).length, $selectedItemChildrenLen = $selectedItem.children(base.o.menuSelector).length;
                if ($.inArray($url.attr("href"), base.o.excludeUri) < 0) {
                    if ($selectedItemChildrenLen > 0) {
                        depth += 1;
                    }
                    base.gotoSelected(depth, false);
                    base._heightFix($selectedItemChildrenLen);
                }
            }
            if (base.o.onInit && typeof(base.o.onInit) === "function") {
                base.o.onInit(base);
            }
            base.$multiSlideMenu.trigger("onInit." + base.o.namespace + pluginName);
        };
        var oldBase = $(el).data(pluginName);
        if (typeof oldBase === "object") {
            $.each(options, function (k, v) {
                if (typeof oldBase[k] === "function") {
                    oldBase[k](v);
                } else {
                    if (oldBase.o.hasOwnProperty(k)) {
                        oldBase.o[k] = v;
                    }
                }
            });
        } else {
            base.init();
        }
    };
    $.multiSlideMenu.defaults = {
        namespace: "multi",
        slideSpeed: 300,
        slideEasing: "linear",
        backLinkContent: "Назад",
        backOnTop: true,
        selectedClass: "selected",
        loadContainer: "",
        minHeightMenu: 0,
        autoHeightMenu: true,
        excludeUri: ["/", "#"],
        loadOnlyLatest: false,
        menuSelector: "ul",
        itemSelector: "li",
        setTitle: true,
        scrollToTopSpeed: 200,
        onInit: null,
        onSlideForward: null,
        onSlideBack: null,
        onLatestClick: null,
        afterSlide: null,
        beforeLoad: null,
        afterLoadAlways: null,
        afterLoadDone: null,
        afterLoadFail: null,
        classNames: {
            navigationClass: "-nav",
            wrapperClass: "-wrapper",
            allMenusClass: "-menu",
            inheritedMenuClass: "-inheritedmenu",
            menuItemBackClass: "-back",
            loadingClass: "-loading"
        }
    };
    $.fn.multiSlideMenu = function (key, val) {
        return this.each(function () {
            var options;
            if (typeof key !== "object" && typeof val !== "undefined") {
                options = {};
                options[key] = val;
            } else {
                options = key;
            }
            var t = new $.multiSlideMenu(this, options);
        });
    };
}(jQuery, window, document));