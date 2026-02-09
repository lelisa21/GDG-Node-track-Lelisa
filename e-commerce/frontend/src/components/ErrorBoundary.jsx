import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <button onClick={() => window.location.reload()} className="text-blue-600">
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
