import { NextPage } from 'next';


interface ProjectProps {
    params: any; // Adjust the type according to your requirements
}

export default function projects({ params }: ProjectProps) {
    return (
        <>
            <h1>{params.projects}</h1>
        </>
    )
} 

