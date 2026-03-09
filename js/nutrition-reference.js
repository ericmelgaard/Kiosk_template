"use strict";

var NutritionReference = (function () {

    var dailyValues = {
        total_fat: 78,
        saturated_fat: 20,
        trans_fat: 0,
        cholesterol: 300,
        sodium: 2300,
        total_carbohydrate: 275,
        dietary_fiber: 28,
        total_sugars: 50,
        added_sugars: 50,
        protein: 50,
        vitamin_d: 20,
        calcium: 1300,
        iron: 18,
        potassium: 4700
    };

    var units = {
        total_fat: 'g',
        saturated_fat: 'g',
        trans_fat: 'g',
        cholesterol: 'mg',
        sodium: 'mg',
        total_carbohydrate: 'g',
        dietary_fiber: 'g',
        total_sugars: 'g',
        added_sugars: 'g',
        protein: 'g',
        vitamin_d: 'mcg',
        calcium: 'mg',
        iron: 'mg',
        potassium: 'mg'
    };

    function calculateDailyValue(nutrient, amount) {
        if (!dailyValues[nutrient] || !amount) {
            return null;
        }
        var percentage = Math.round((amount / dailyValues[nutrient]) * 100);
        return percentage;
    }

    function getDailyValue(nutrient) {
        return dailyValues[nutrient] || null;
    }

    function getUnit(nutrient) {
        return units[nutrient] || '';
    }

    return {
        calculateDailyValue: calculateDailyValue,
        getDailyValue: getDailyValue,
        getUnit: getUnit,
        dailyValues: dailyValues
    };
})();
