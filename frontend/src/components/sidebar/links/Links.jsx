import { motion } from "framer-motion";

const variants = {
    open: {
        transition: {
            staggerChildren: 0.1,
        },
    },
    closed: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        }
    }
};

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
    },
    closed: {
        y: 50,
        opacity: 0,
    }
};

const Links = () => {

    return (
        <motion.div className="links" variants={variants}>
            <motion.a href='#Homepage' key='Homepage' variants={itemVariants} whileHover={{scale:1.1}} whileTap={{scale:0.95}}>Homepage</motion.a>
            <motion.a href='#About' key='About' variants={itemVariants} whileHover={{scale:1.1}} whileTap={{scale:0.95}}>About</motion.a>
            <motion.a href='#Projects' key='Projects' variants={itemVariants} whileHover={{scale:1.1}} whileTap={{scale:0.95}}>Projects</motion.a>
            <motion.a href='#Experience' key='Experience' variants={itemVariants} whileHover={{scale:1.1}} whileTap={{scale:0.95}}>Experience</motion.a>
            <motion.a href='#Contact' key='Contact' variants={itemVariants} whileHover={{scale:1.1}} whileTap={{scale:0.95}}>Contact</motion.a>
        </motion.div>
    );
};

export default Links;
