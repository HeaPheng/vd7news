import Navbar from "./Navbar";
import { getCategories, type WPCategory } from "@/lib/wordpress";

const allowedCategorySlugs = [
  "national-news",
  "international-news",
  "economy",
  "real-estate",
  "social-events",
  "others",
];

export default async function Header() {
  const categories = await getCategories();

  const filteredCategories = allowedCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is WPCategory => Boolean(category));

  const menuItems = [
    { name: "ទំព័រដើម", href: "/" },
    ...filteredCategories.map((category) => ({
      name: category.name,
      href: `/category/${category.slug}`,
    })),
  ];

  return <Navbar menuItems={menuItems} />;
}