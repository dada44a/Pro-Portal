import React from "react";

export function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`card card-border bg-base-100  ${className}`}>{children}</div>;
}

export function CardBody({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`card-body ${className}`}>{children}</div>;
}

export function CardTitle({
    title,
    className = "",
}: {
    title: string;
    className?: string;
}) {
    return <h2 className={`card-title ${className}`}>{title}</h2>;
}

export function CardDescription({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`card-description ${className}`}>{children}</div>;
}

export function CardActions({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`card-actions ${className}`}>{children}</div>;
}