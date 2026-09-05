"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./store.module.css";

const products = [
    { id: 1, name: "Bamboo trail basket", category: "Bamboo handicrafts", price: 1250, stock: 8, art: "B" },
    { id: 2, name: "Handwoven yak wool stole", category: "Yak wool products", price: 2400, stock: 3, art: "Y" },
    { id: 3, name: "Monpa bead bracelet", category: "Tribal jewelry", price: 780, stock: 14, art: "M" },
    { id: 4, name: "Smoked king chilli salt", category: "Local food items", price: 360, stock: 11, art: "C" },
];

export default function StoreFront() {
    const [category, setCategory] = useState("All");
    const [cart, setCart] = useState<number[]>([]);
    const visible = products.filter((product) => category === "All" || product.category === category);
    const total = cart.reduce((sum, id) => sum + (products.find((product) => product.id === id)?.price ?? 0), 0);

    return <main className={styles.store}>
        <section className={styles.hero}><div className="wrap"><p>From the eastern Himalaya</p><h1>Useful things, made <em>close to the trail.</em></h1><span>Every purchase supports an independent maker in Arunachal Pradesh.</span></div></section>
        <section className={`wrap ${styles.catalogue}`}><div className={styles.topline}><div><p className={styles.eyebrow}>Mountain makers</p><h2>Take a little Arunachal home.</h2></div><div className={styles.cart}>Cart <strong>{cart.length}</strong>{cart.length > 0 && <small>₹{total.toLocaleString("en-IN")}</small>}</div></div><div className={styles.filters}>{["All", "Bamboo handicrafts", "Yak wool products", "Tribal jewelry", "Local food items"].map((item) => <button key={item} onClick={() => setCategory(item)} className={category === item ? styles.active : ""}>{item}</button>)}</div><div className={styles.grid}>{visible.map((product) => <article className={styles.product} key={product.id}><div className={styles.art}>{product.art}<span>{product.stock} left</span></div><p>{product.category}</p><h3>{product.name}</h3><div className={styles.price}><strong>₹{product.price.toLocaleString("en-IN")}</strong><button onClick={() => setCart([...cart, product.id])}>Add to cart</button></div><button className={styles.detail}>View details</button></article>)}</div>{cart.length > 0 && <div className={styles.checkout}><div><strong>{cart.length} item{cart.length > 1 ? "s" : ""} selected</strong><span>Secure checkout · Delivery tracked from the maker</span></div><button onClick={() => setCart([])}>Place order · ₹{total.toLocaleString("en-IN")}</button></div>}<div className={styles.seller}><div><p>Make with us</p><h2>Are you an Arunachal maker?</h2><span>Create a seller profile to list products, handle orders and see earnings in Trail Hub.</span></div><Link href="/login?mode=register">Join as a local seller</Link></div></section>
    </main>;
}
