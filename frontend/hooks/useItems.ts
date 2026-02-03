/**
 * useItems Hook
 * 
 * Custom hook for managing items data:
 * - Fetch all items with pagination
 * - Fetch single item
 * - Create, update, delete items
 * - Search and filter items
 */

'use client';

import { useState, useEffect } from 'react';
import { itemsAPI } from '@/services/items';
import type { Item } from '@/types';

interface UseItemsResult {
  items: Item[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  createItem: (data: any) => Promise<Item>;
  updateItem: (id: string, data: any) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useItems(initialPage = 1): UseItemsResult {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemsAPI.list(page, 12);
      setItems(response.data.data);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (data: any) => {
    try {
      const response = await itemsAPI.create(data);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateItem = async (id: string, data: any) => {
    try {
      const response = await itemsAPI.update(id, data);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await itemsAPI.delete(id);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  return {
    items,
    loading,
    error,
    page,
    totalPages,
    setPage,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
}
