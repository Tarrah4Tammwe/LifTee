'use client';

import { useState, useEffect } from 'react';
import { Search, Loader, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Food } from '@/lib/db';

export default function FoodTab() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [searchQuery, selectedCategory, foods]);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getFoods();
      setFoods(data);
    } catch (error) {
      console.error('Failed to load foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFoods = async () => {
    let filtered = foods;

    if (searchQuery) {
      filtered = await apiClient.searchFoods(searchQuery);
    }

    if (selectedCategory) {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    setFilteredFoods(filtered);
  };

  const categories = Array.from(new Set(foods.map((f) => f.category)));

  const toggleFoodSelection = (food: Food) => {
    setSelectedFoods((prev) =>
      prev.find((f) => f.id === food.id)
        ? prev.filter((f) => f.id !== food.id)
        : [...prev, food]
    );
  };

  const totalNutrition = selectedFoods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-light mb-6">Food Database</h1>

      {/* Search and Filter */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-light opacity-50" size={20} />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark border border-white border-opacity-10 rounded-lg text-light placeholder:text-light placeholder:opacity-50"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === null
                  ? 'bg-primary text-light'
                  : 'bg-dark border border-white border-opacity-10 text-light hover:border-primary'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition capitalize ${
                  selectedCategory === cat
                    ? 'bg-primary text-light'
                    : 'bg-dark border border-white border-opacity-10 text-light hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Food List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-primary" size={32} />
            </div>
          ) : filteredFoods.length > 0 ? (
            <div className="space-y-3">
              {filteredFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => toggleFoodSelection(food)}
                  className={`w-full card p-4 text-left transition ${
                    selectedFoods.find((f) => f.id === food.id)
                      ? 'border-primary bg-opacity-50'
                      : 'hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-light mb-1">
                        {food.name}
                      </h3>
                      <p className="text-xs text-light opacity-50 capitalize mb-2">
                        {food.category}
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-light opacity-70">
                            {food.calories}
                          </span>
                          <br />
                          <span className="text-light opacity-50">kcal</span>
                        </div>
                        <div>
                          <span className="text-light opacity-70">
                            {food.protein}g
                          </span>
                          <br />
                          <span className="text-light opacity-50">protein</span>
                        </div>
                        <div>
                          <span className="text-light opacity-70">
                            {food.carbs}g
                          </span>
                          <br />
                          <span className="text-light opacity-50">carbs</span>
                        </div>
                        <div>
                          <span className="text-light opacity-70">
                            {food.fat}g
                          </span>
                          <br />
                          <span className="text-light opacity-50">fat</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded border-2 transition flex-shrink-0 ml-4 ${
                        selectedFoods.find((f) => f.id === food.id)
                          ? 'bg-primary border-primary'
                          : 'border-white border-opacity-10'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12 text-light opacity-60">
              No foods found. Try a different search!
            </div>
          )}
        </div>

        {/* Selected Foods Summary */}
        <div className="space-y-4">
          <div className="card sticky top-4">
            <h2 className="font-semibold text-light mb-4">Selected Foods</h2>

            {selectedFoods.length > 0 ? (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {selectedFoods.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-2 bg-dark rounded"
                    >
                      <span className="text-sm text-light">{food.name}</span>
                      <button
                        onClick={() => toggleFoodSelection(food)}
                        className="text-xs text-light opacity-50 hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white border-opacity-10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-light">
                    <span>Total Calories:</span>
                    <span className="font-semibold">{totalNutrition.calories}</span>
                  </div>
                  <div className="flex justify-between text-sm text-light">
                    <span>Protein:</span>
                    <span className="font-semibold">{totalNutrition.protein}g</span>
                  </div>
                  <div className="flex justify-between text-sm text-light">
                    <span>Carbs:</span>
                    <span className="font-semibold">{totalNutrition.carbs}g</span>
                  </div>
                  <div className="flex justify-between text-sm text-light">
                    <span>Fat:</span>
                    <span className="font-semibold">{totalNutrition.fat}g</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 bg-gradient-to-r from-primary to-secondary text-light font-semibold rounded-lg hover:opacity-90 transition">
                  <Plus size={18} className="inline mr-2" /> Log Meal
                </button>
              </>
            ) : (
              <p className="text-light opacity-60 text-center py-8">
                Select foods to log a meal
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
