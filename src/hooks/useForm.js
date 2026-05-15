import { useState } from "react";

function useForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    time: "",
    tags: [],
    img: "",
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
  });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTagToggle = (tag) => {
        if (form.tags.includes(tag)) {
            setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
        } else {
            setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
        }
    };

    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            time: "",
            tags: [],
            img: "",
        });
    };

    return [form, handleChange, handleTagToggle, resetForm];
}

export default useForm;
