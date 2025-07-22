import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const storedMode = localStorage.getItem("darkMode") === "true"
        setDarkMode(storedMode)
        if (storedMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [])

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev
            localStorage.setItem("darkMode", newMode.toString())
            if (newMode) {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }
            return newMode
        })
    }

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 text-sm font-semibold bg-gray-200 rounded-md dark:bg-neutral-700 dark:text-white hover:cursor-pointer"
        >
            <div className="w-5 h-5 flex justify-center items-center">
                {darkMode ? <Sun /> : <Moon />}
            </div>
        </button>
    )
}

export default DarkModeToggle
