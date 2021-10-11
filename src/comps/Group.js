import React from "react";


const Group = (probs) => {
    const {
        name, children, className,
    } = probs;

    let content_class = "group-content";
    if (className)
        content_class += " " + className;

    return (
        <div className={"group"}>
            <div className={"name"}>{name}</div>
            <div className={content_class}>{children}</div>
        </div>
    )
};


export default Group;