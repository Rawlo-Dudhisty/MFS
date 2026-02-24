export interface Product {
  id: number
  name: string
  category: 'tops' | 'bottoms' | 'outerwear' | 'accessories'
  cat: string
  price: number
  oldPrice?: number
  emoji: string
  tag?: string
  color: string
  description: string
  tags: string[]
}

export interface CartItem extends Product {
  qty: number
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
